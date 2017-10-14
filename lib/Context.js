
const User = require('./User');
const DeferredPromise = require('./utils/DeferredPromise');

class Context {
    constructor(bot, channel, user, message) {
        this.bot = bot;
        this.user = user;
        this.channel = channel;
        this.messages = [message];
        this.message = message;

        this.i = new Myself(this);
        this.startedAt = new Date();
        this.roundTripCount = 0;

        this.listening = {};
    }

    waitForMessage(user) {
        let promise = this.listening[user.id];
        if (!promise) {
            // register new listener promise.
            promise = new DeferredPromise();
            this.listening[user.id] = promise;
        }
        return promise.promise;
    }

    returnToHandler(message) {
        const {userId} = message.data;
        if (!(this.listening[userId] instanceof DeferredPromise)) {
            throw new Error(`No listener available at user ${userId}`);
        }
        this.listening[userId].resolve(message);
        this.listening[userId] = null;
    }
}

/**
 * An interface for intent handler.
 */
class Myself extends User {
    constructor(context) {
        super('me');
        this.context = context;
    }

    /**
     * Send message to given {@link User}.
     *
     * @param message {Message | String} A {@link Message} or a string, you want to send.
     * @param to {User | String} Optional - A target user you want to send to.
     * @returns {Promise.<void>}
     */
    async speak(message, to = this.context.user) {
        const {bot} = this.context;

        // process message through outgoing middlewares.
        await bot.outgoing.handle(message, this.context);

        bot.emit('speak', message, to);
    }

    /**
     * Listen to given {@link User} and returns {@link Message} of user.
     *
     * @param to
     * @returns {Promise.<void>}
     */
    async listen(to = this.context.user) {
        this.context.bot.emit('listen', to);
        return await this.context.waitForMessage(to);
    }

    async ask(question, to = this.context.user) {
        await this.speak(question, to);
        return await this.listen(to);
    }

    async closeDialogue() {

    }
}


module.exports = Context;