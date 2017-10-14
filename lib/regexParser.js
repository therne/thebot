
function regexParser(patterns) {
    return async function regexParser(context, next) {
        const {message} = context;
        for (const intent of Object.keys(patterns)) {
            if (message.text.match(patterns[intent])) {
                context.intent = intent;
            }
        }
        await next;
    }
}

module.exports = regexParser;