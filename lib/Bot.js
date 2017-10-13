
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
        this.incoming = new Middlewares();
        this.outgoing = new Middlewares();

        // incoming message
        const maybeStartConversation = this.maybeStartConversation.bind(this);
        this.incoming.use(maybeStartConversation);

        this.intentHandlers = new Map();
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
     * Calls intent handler.
     * @param context {Context}
     * @returns {Promise.<void>}
     */
    async emitIntent(context) {
        const {intent} = context;
        if (!intent) {
            throw Error('Parser is not called. Have you forgot to use parser at incoming?');
        }
        if (this.intentHandlers.has(intent)) {
            const handler = this.intentHandlers.get(intent);
            await handler.handle(context);
        }
    }

    async maybeStartConversation(message, context, precedingParsers) {
        await precedingParsers;

        let context = this.contextRepo.findContextOf(message);
        if (context) {
            context.messages.push(message);
            context.returnToHandler(message);
            return;
        }

        if (this.canStartConversation(message)) {
            // create and register new context
            const {userId, userInfo} = message.additionalInfo;
            const user = new User(userId, userInfo);

            context = new Context(this, channel, user, message);
            this.contextRepo.add(context);

            // start conversation handler
            this.emitIntent(context);
        }
    }

    canStartConversation(message) {
        // override it freely!
        return true;
    }
}

module.exports = Bot;