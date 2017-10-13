
class ContextRepository {
    constructor() {
        this.contexts = new Map();
    }

    add(context) {
        this.contexts.set(context.getUniqueKey(), context);
    }

    findContextOf(message) {
        return this.contexts.get(message.uniqueKey);
    }
}
