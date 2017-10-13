
class DeferredPromise extends Promise {
    constructor() {
        super((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}

module.exports = DeferredPromise;