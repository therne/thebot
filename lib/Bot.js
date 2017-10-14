
const mixin = require('es6-mixins');
const EventEmitter = require('events');
const User = require('./User');
const Context = require('./Context');
const Middlewares = require('./Middlewares');
const ContextRepository = require('./ContextRepository');

/**
 * Bot represents router can handle intents.
 */
class Bot extends Middlewares {
    constructor() {
        super();
        mixin(EventEmitter, this);

        this.incoming = new Middlewares();
        this.outgoing = new Middlewares();

        // incoming message
        const maybeStartConversation = this.maybeStartConversation.bind(this);
        this.incoming.use(maybeStartConversation);

        // conversation handlers
        this.intentHandlers = new Map();
        this.notFound = new Middlewares();

        this.contextRepo = new ContextRepository();
    }

    /**
     * Registers intent handler.
     * @param intent {String}
     * @param handler {Function}
     */
    when(intent, handler) {
        let handlerMiddlewares = this.intentHandlers.get(intent);
        if (!handlerMiddlewares) {
            handlerMiddlewares = new Middlewares();
            this.intentHandlers.set(intent, handlerMiddlewares);
        }
        // add to existing stack
        handlerMiddlewares.use(handler);
    }

    /**
     * Registers intent handler.
     * @param handler {Function}
     */
    whenNotFound(handler) {
        this.notFound.use(handler);
    }

    /**
     * Calls intent handler.
     * @param context {Context}
     * @returns {Promise.<void>}
     */
    async emitIntent(context) {
        const {intent} = context;
        if (this.intentHandlers.has(intent)) {
            const handler = this.intentHandlers.get(intent);
            await handler.handle(context);

        } else {
            await this.notFound.handle(context);
        }
        // remove context after conversation
        this.contextRepo.remove(context);
        this.emit('end', context.user);
    }

    async handleMessage(message, channel) {
        let context = this.contextRepo.findContextOf(message);
        if (context) {
            context.messages.push(message);
            context.returnToHandler(message);
            return;
        }

        // create and register new context
        const {userId, userInfo} = message.data;
        const user = new User(userId, userInfo);

        context = new Context(this, channel, user, message);
        this.contextRepo.add(context);

        return await this.incoming.handle(context);
    }

    async maybeStartConversation(context, next) {
        await next();

        if (!context.hasCalled) {
            context.hasCalled = true;
            await this.emitIntent(context);
        }
    }
}

module.exports = Bot;