
const prompt = require('prompt-promise');
const Channel = require('./Channel');
const waitForEvent = require('./utils/wait-for-event');

class ConsoleChannel extends Chyannel {
    constructor() {
        super();

        this.on('start', async bot => {
            while (true) {
                const text = await prompt('> ');
                if (text === 'exit') break;
                await this.handle({
                    text,
                    userId: 'user',
                    userInfo: {},
                });
                await waitForEvent(this, 'send');
            }
        });
    }

    async send(message, to) {
        console.log(message);
        super.send(message, to);
    }
}

module.exports = ConsoleChannel;