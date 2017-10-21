
function regexParser(patterns) {
    return async function regexParser(context, next) {
        const {message} = context;
        Object.keys(patterns).forEach((intent) => {
            if (message.text.match(patterns[intent])) {
                context.intent = intent;
            }
        });
        await next;
    }
}

module.exports = regexParser;
