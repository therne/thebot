
const mixin = require('es6-mixins');
const EventEmitter = require('events');
const User = require('./User');
const Router = require('./Router');
const Context = require('./Context');
const Middlewares = require('./Middlewares');
const ContextRepository = require('./ContextRepository');

/**
 * Bot represents router can handle intents.
 */
class Bot extends Router {
    constructor() {
        super();
        mixin(EventEmitter, this);

        this.incoming = new Middlewares();
        this.outgoing = new Middlewares();

        this.contextRepo = new ContextRepository();
    }

    async handleMessage(message, channel) {
        let startConversation = false;

        let context = this.contextRepo.findContextOf(message);
        if (!context) {
            // create and register new context
            const {userId, userInfo} = message.data;
            const user = new User(userId, userInfo);

            context = new Context(this, channel, user, message);
            this.contextRepo.add(context);
            startConversation = true;
        }

        // process context using incoming middlewares
        await this.incoming.handle(context);

        if (startConversation) {
            await this.handle(context);

            // conversation is ended. remove context.
            this.contextRepo.remove(context);
            this.emit('end', context.user);

        } else {
            context.messages.push(message);
            context.returnToHandler(message);
        }
    }
}

module.exports = Bot;