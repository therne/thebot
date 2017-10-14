
const composedFunction = Symbol();

class Middlewares {
    constructor() {
        this.middlewares = [];
    }

    use(...middlewares) {
        this.middlewares.push(...middlewares);
    }

    async handle(...args) {
        // cache the composed middleware
        if (!this[composedFunction]) {
            this[composedFunction] = compose(this.middlewares);
        }
        return await this[composedFunction](...args);
    }
}

module.exports = Middlewares;

/**
 * Composes middleware into a function.
 * Code from {@link https://github.com/koajs/compose}
 *
 * @returns {Function} a fully valid middleware comprised of all those which are passed.
 * @private
 */
function compose(middlewares) {
    return function(...args) {
        // last called middleware #
        let index = -1;
        return dispatch(0);
        function dispatch(i) {
            if (i <= index) return Promise.reject(new Error('next() called multiple times'));
            index = i;
            let fn = middlewares[i];
            if (i === middlewares.length) fn = noop;
            if (!fn) return Promise.resolve();
            try {
                return Promise.resolve(fn(...args, function next() {
                    return dispatch(i + 1);
                }))
            } catch (err) {
                return Promise.reject(err)
            }
        }
    }
}

async function noop() {}
