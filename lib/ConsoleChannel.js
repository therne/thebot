
const prompt = require('prompt-promise');
const Channel = require('./Channel');
const waitForEvent = require('./utils/wait-for-event');

class ConsoleChannel extends Channel {
    constructor() {
        super();
        this.on('start', this.startBot.bind(this));
    }

    startBot(bot) {
        bot.on('listen', () => this.loop());
        bot.on('end', () => this.loop());
        bot.on('speak', message => {
            console.log(message);
        });
        this.loop();
    }

    loop() {
        (async () => {
            const text = await prompt('> ');
            if (text === 'exit') process.exit();

            // send message to bot
            this.handle({
                text,
                userId: '<console>',
                userInfo: {},
            });
        })().catch(err => console.error(err.stack));
    }
}

module.exports = ConsoleChannel;
