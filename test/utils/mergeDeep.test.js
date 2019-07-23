import {mergeDeep} from "../../src/utils";

test('merge deep', () => {
    const original = {
        number: 1,
        string: 'string',
        array: [1, 'string'],
        nested: {
            number: 2,
            string: 'string2',
        },
    };

    const result = mergeDeep(original, {
        string: 'newstring',
        array: [],
        nested: {
            number: 100
        }
    });

    expect(result).toStrictEqual({
        number: 1,
        string: 'newstring',
        array: [],
        nested: {
            number: 100,
            string: 'string2',
        },
    });

    // test if nested object is cloned
    result.nested.number = 999;
    // if original will not change
    expect(original.nested.number).toBe(2);
});

test('merge deep without change', () => {
    const original = {
        number: 1,
        string: 'string',
        array: [1, 'string'],
        nested: {
            number: 2,
            string: 'string2',
        },
    };

    const result = mergeDeep(original, {});

    expect(result).toBe(original);
});