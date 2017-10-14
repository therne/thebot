
class ContextRepository {
    constructor() {
        this.contexts = new Map();
    }

    add(context) {
        this.contexts.set(context.message.uniqueKey, context);
    }

    findContextOf(message) {
        return this.contexts.get(message.uniqueKey);
    }

    remove(context) {
        this.contexts.delete(context.message.uniqueKey);
    }
}

module.exports = ContextRepository;
