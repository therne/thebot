
const EventEmitter = require('events').EventEmitter;

module.exports = function waitForEvent(eventEmitter, eventName) {
    return new Promise(resolve => eventEmitter.once(eventName, resolve));
};
