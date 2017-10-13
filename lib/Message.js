
class Message {
    constructor(text, data = {}) {
        this.text = text;
        this.data = data;
    }

    /**
     * @returns {String} Unique identifier of a Message, made from additionalInfo.
     * This is used to match context in {@link ContextRepository}.
     *
     * If no additionalInfo is present, {@code null) will be returned.
     */
    get uniqueKey() {
        if (!this.data) return;
        const lexicalOrderedKeys = Object.keys(this.data).sort((a, b) => a.localeCompare(b));
        return lexicalOrderedKeys.map(key => `${key}=${this.data[key]}`).join('&');
    }
}

module.exports = Message;