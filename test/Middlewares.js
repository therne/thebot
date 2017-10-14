
const {expect} = require('chai');
const Middlewares = require('../lib/Middlewares');

describe('Middlewares', () => {
    describe('#use', () => {
        it.only('should add middleware to the stack', () => {
            const middlewares = new Middlewares();
            middlewares.use(async () => {});

            expect(middlewares.middlewares).to.have.lengthOf(1);
        });

        it.only('should accept multiple arguments', () => {
            const middlewares = new Middlewares();
            const md = async () => {};
            middlewares.use(md, md, md, md);

            expect(middlewares.middlewares).to.have.lengthOf(4);
        });

        it.only('should accept zero arguments', () => {
            const middlewares = new Middlewares();
            middlewares.use();

            expect(middlewares.middlewares).to.have.lengthOf(0);
        });
    });

    describe('#handle', () => {
        it.only('should return last results.', async () => {
            const middlewares = new Middlewares();
            middlewares.use(async () => 'Foo');

            const result = await middlewares.handle();
            expect(result).to.equal('Foo');
        });

        it.only('should run middleware in order.', async () => {
            const middlewares = new Middlewares();

            let executedOrder = '';
            let answer = '';
            for (let i=0; i<5; i++) {
                middlewares.use(async next => {
                    executedOrder += `${i}`;
                    await next();
                });
                answer += `${i}`;
            }
            await middlewares.handle();
            expect(executedOrder).to.equal(answer);
        });

        it.only('can run middleware in reverse order.', async () => {
            const middlewares = new Middlewares();

            let executedOrder = '';
            for (let i=0; i<5; i++) {
                middlewares.use(async next => {
                    await next();
                    executedOrder += `${i}`;
                });
            }
            await middlewares.handle();
            expect(executedOrder).to.equal('43210');
        });
    });
});