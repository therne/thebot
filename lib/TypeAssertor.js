
function assertType(name, type, value) {
    if (type instanceof Function && !(value instanceof type)) {
        throw Error(`${name} must be a ${type.name}.`);

    } else if (type instanceof Array) {
        assertType(name, Array, value);
        const [innerType] = type;
        for (const innerValue of value) {
            assertType(name + '.$', innerType, innerValue);
        }

    } else if (type instanceof Object) {
        assertType(name, Object, value);

        for (const key of Object.keys(type)) {
            assertType(`${name}.${key}`, type[key], value[key]);
        }
    }
}

const NewType = new typed.Type({
    hello: String,
    value: !NewType,
});

class SomeClass {
    
    @type({ hello: number, assert: string })
    hello(hello /*Number*/, caller /*String*/) {
        assertTypeOf(arguments, {
            hello: [String],
            caller: ![Value]
        });
    }
}

module.exports = assertType;