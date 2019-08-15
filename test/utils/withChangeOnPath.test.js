import {withChangeOnPath} from "../../src/utils";

test('create new object with new value on path', () => {
    const source = {first: 1, second: {test: [1, 2, 3, 4, 5]}};
    const result = withChangeOnPath(source, ['foo', 'bar'], 'baz');
    // not mutated source
    expect(result).not.toBe(source);
    // has expected new values on path
    expect(result).toStrictEqual({...source, foo: {bar: 'baz'}});
    // others are the same
    expect(result.first).toBe(source.first);
    expect(result.second).toBe(source.second);
});

test('create new object with changed value on path', () => {
    const source = {first: 1, second: {test: [1, 2, 3, 4, 5]}, foo: {bar: 'baz'}};
    const result = withChangeOnPath(source, ['foo', 'bar'], 'changed');

    expect(result).toStrictEqual({...source, foo: {bar: 'changed'}});
    expect(result.foo).not.toBe(source.foo);
});