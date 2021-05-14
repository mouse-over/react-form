import React from 'react';
import {act, cleanup} from "@testing-library/react";
import setup from "./setup";

const validationRules = {
    container: {
        children: {
            foo: {
                required: {message: 'Please set!'},
                min: 5,
                minLength: 2
            },
            bar: {
                required: true
            }
        }
    }
};

const values = {
    container: {
        foo: 20,
        bar: 'bar'
    }
};

afterEach(cleanup);

test('useForm nested output props check', () => {
    const {valuesRef} = setup({values, validationRules});
    expect(valuesRef.current.setValue).toBeInstanceOf(Function);
    expect(valuesRef.current.setValues).toBeInstanceOf(Function);
    expect(valuesRef.current.handleSubmit).toBeInstanceOf(Function);
    expect(valuesRef.current.values).toStrictEqual(values);
    expect(valuesRef.current.defaultValues).toStrictEqual(values);
    expect(valuesRef.current.lastChanged).toStrictEqual(["container"]);
    expect(valuesRef.current.validation).toBeInstanceOf(Object);
    expect(valuesRef.current.validation.valid).toBeTruthy();
});

test('useForm nested change single value valid', () => {
    const {valuesRef, onValuesChange, onValueChange} = setup({values, validationRules});

    act(()=>{
        valuesRef.current.setValue(12, ['container','foo']);
    });

    const expectedValues = {...values, container: {...values.container, foo: 12}};
    expect(valuesRef.current.values).toStrictEqual(expectedValues);
    expect(valuesRef.current.lastChanged).toStrictEqual([
        [
            "container",
            "foo"
        ]
    ]);
    expect(valuesRef.current.validation.valid).toBeTruthy();

    expect(onValueChange).toBeCalledWith(['container','foo'], 12, true);
    expect(onValuesChange).toBeCalledWith(expectedValues, true);
});

test('useForm nested change single value invalid', () => {
    const {valuesRef, onValuesChange, onValueChange} = setup({values, validationRules});

    act(()=>{
        valuesRef.current.setValue(2, ['container','foo']);
    });

    expect(valuesRef.current.validation.valid).toBeFalsy();
    expect(onValueChange).toBeCalledWith(['container','foo'], 2, false);
    expect(onValuesChange).toBeCalledWith({container: {...values.container, foo: 2}}, false);
});

test('useForm nested change multiple values valid', () => {
    const {valuesRef, onValuesChange} = setup({values, validationRules});

    const expectedValues = {container: {foo: 12, bar: 'changed value'}};

    act(()=>{
        valuesRef.current.setValues(expectedValues);
    });

    expect(valuesRef.current.values).toStrictEqual(expectedValues);
    expect(valuesRef.current.lastChanged).toStrictEqual(['container']);
    expect(valuesRef.current.validation.valid).toBeTruthy();

    expect(onValuesChange).toBeCalledWith(expectedValues, true);
});

test('useForm nested change multiple values invalid', () => {
    const {valuesRef, onValuesChange} = setup({values, validationRules});

    const expectedValues = {container: {foo: 2, bar: 'changed value'}};

    act(()=>{
        valuesRef.current.setValues(expectedValues);
    });

    expect(valuesRef.current.validation.valid).toBeFalsy();
});

test('useForm nested change from outside - valid single value', () => {
    const {valuesRef, onValuesChange, onValueChange, changeProps} = setup({values, validationRules});

    // mimic outside change with valid single value
    act(()=> {
        changeProps({values: {container: {foo: 12}}});
    });
    expect(valuesRef.current.validation.valid).toBeTruthy();
    expect(valuesRef.current.lastChanged).toStrictEqual(['container']);
    expect(onValueChange).toBeCalled();
    expect(onValuesChange).toBeCalled();
});

test('useForm nested change from outside - invalid single value', () => {
    const {valuesRef, onValuesChange, onValueChange, changeProps} = setup({values, validationRules});
    act(()=> {
        changeProps({values: {container: {foo: 2}}});
    });
    expect(valuesRef.current.validation.valid).toBeFalsy();
    expect(valuesRef.current.lastChanged).toStrictEqual(['container']);
    expect(onValueChange).toBeCalled();
    expect(onValuesChange).toBeCalled();
});

test('useForm nested submit invalid', () => {
    const invalidValues = {container: {...values.container,  foo: 2}};
    const {valuesRef, onSubmit} = setup({values: invalidValues, validationRules});
    act(()=> {
        valuesRef.current.handleSubmit();
    });
    expect(onSubmit).toBeCalledWith(invalidValues, false, valuesRef.current);
});

test('useForm nested submit valid', () => {
    const {valuesRef, onSubmit} = setup({values, validationRules});
    act(()=> {
        valuesRef.current.handleSubmit();
    });
    expect(onSubmit).toBeCalledWith(values, true, valuesRef.current);
});

test('useForm nested change custom validation rule - valid', () => {
    validationRules.container.children.foo = {
        custom: {
            message: "hej",
            validate: () => true
        }
    };
    const {valuesRef} = setup({values, validationRules});
    expect(valuesRef.current.validation.valid).toBeTruthy();
});
