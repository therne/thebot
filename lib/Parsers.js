
function regexParser(patterns) {
    return async function(message, ctx) {
        for (const intent of Object.keys(patterns)) {
            if (message.text.match(patterns[intent])) {
                message.intent = intent;
            }
        }

    }
}