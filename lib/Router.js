const Middlewares = require('./Middlewares');

/**
 * Router handles conversation.
 * TODO: too low performance O(n). Optimize it to be O(1)
 */
class Router extends Middlewares {

    /**
     * Registers intent handler.
     * @param intent {String}
     * @param handler {Function}
     */
    when(intent, handler) {
        const realHandler = handler instanceof Router ? handler.handle : handler;

        // add handler middleware that filters only matching intent.
        super.use(async (context, next) => {
            if (context.intent === intent) await realHandler(context, next);
            else await next();
        });
    }
}

module.exports = Router;