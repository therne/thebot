
const mixins = require('es6-mixins');
const EventEmitter = require('events');
const Middlewares = require('./Middlewares');
const Message = require('./Message');

const handleMessage = Symbol();

class Channel extends Middlewares {
    constructor() {
        super();
        mixins(EventEmitter, this);

        this.bots = [];

        // add message handler middleware.
        const messageHandler = this[handleMessage].bind(this);
        this.use(messageHandler);
    }

    async [handleMessage](payload, next) {
        // executed at last.
        await next();

        const {text, ...data} = payload;
        const message = new Message(text, data);

        for (const bot of this.bots) {
            if (bot.contextRepo.findContextOf(message) || this.isMentioned(bot, message)) {
                // process message through incoming middlewares.
                await bot.handleMessage(message, this);
                break;
            }
        }
        this.emit('message', message);
    }

    start(bot) {
        this.bots.push(bot);
        this.emit('start', bot);
    }

    isMentioned(bot, message) {
        // Override it freely.
        return true;
    }
}

module.exports = Channel;