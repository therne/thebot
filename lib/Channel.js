
const mixins = require('es6-mixins');
const EventEmitter = require('events');
const Middlewares = require('./Middlewares');
const Message = require('./Message');

const handleMessage = Symbol();

class Channel extends Middlewares {
    constructor() {
        super();
        mixins(EventEmitter, Channel);

        this.bots = [];

        // add message handler middleware.
        const messageHandler = this[handleMessage].bind(this);
        this.use(messageHandler);
    }

    async [handleMessage](payload, next) {
        // executed at last.
        await next;

        const {text, ...additionalInfo} = payload;
        const message = new Message(text, additionalInfo);

        for (const bot in this.bots) {
            if (bot.hasContext(message) || this.isMentioned(bot, message)) {
                // process message through incoming middlewares.
                await bot.incoming.handle(message, this.context);
                break;
            }
        }
        this.emit('message', message);
    }

    async send(message, to) {
        this.emit('send', { message, to });
    }

    start(bot) {
        this.bots.push(bot);
        this.emit('start', bot);
    }

    isMentioned(bot: Bot, message: Message) {
        throw new Error('Not implemented.');
    }
}

module.exports = Channel;