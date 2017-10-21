
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

        // Node v >= 8.7.0, should be mentioned.
        const {text, ...data} = payload;
        const message = new Message(text, data);

        this.bots.find((bot) => {
            if (
                bot.contextRepo.findContextOf(message) ||
                this.isMentioned(bot, message)
            ) {
                bot.handleMessage(message, this);
                return true;
            }

            return false;
        });
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
