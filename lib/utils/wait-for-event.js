
const EventEmitter = require('events').EventEmitter;

module.exports = function waitForEvent(eventEmitter, eventName) {
    if (!(eventEmitter instanceof EventEmitter)) {
        throw new Error("You must give EventEmitter to wait for an event.");
    }
    return new Promise(resolve => eventEmitter.once(eventName, resolve));
};
