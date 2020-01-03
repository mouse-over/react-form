import React from 'react';
import {useForm} from "../src";
import {act, cleanup, render} from "@testing-library/react";

const FakeComponent = ({children, props}) => children(useForm(props));

const validationRules = {
    foo: {
        required: {message: 'Please set!'},
        min: 5,
        minLength: 2
    },
    bar: {
        required: true
    }
};

const values = {
    foo: 20,
    bar: 'bar'
};

const setup = (props) => {
    const onValueChange = jest.fn();
    const onValuesChange = jest.fn();
    const onSubmit = jest.fn();
    const returnVal = {current: null};
    const finalProps = {...props, onValueChange, onValuesChange, onSubmit};

    const Component = ({props}) => <FakeComponent props={props}>
        {
            (output) => {
                returnVal.current = output;
                return null;
            }
        }
    </FakeComponent>;

    const renderUtils = render(<Component props={finalProps}/>);
    return {
        valuesRef: returnVal,
        onValuesChange,
        onValueChange,
        onSubmit,
        renderUtils,
        changeProps: (changedProps) => {
            return renderUtils.rerender(<Component props={{...finalProps, ...changedProps}}/>);
        }
    };
};

afterEach(cleanup);

test('useForm output props check', () => {
    const {valuesRef} = setup({values, validationRules});
    expect(valuesRef.current.setValue).toBeInstanceOf(Function);
    expect(valuesRef.current.setValues).toBeInstanceOf(Function);
    expect(valuesRef.current.handleSubmit).toBeInstanceOf(Function);
    expect(valuesRef.current.values).toStrictEqual(values);
    expect(valuesRef.current.defaultValues).toStrictEqual(values);
    expect(valuesRef.current.lastChanged).toStrictEqual(['foo', 'bar']);
    expect(valuesRef.current.validation).toBeInstanceOf(Object);
    expect(valuesRef.current.validation.valid).toBeTruthy();
});

test('useForm change single value valid', () => {
    const {valuesRef, onValuesChange, onValueChange} = setup({values, validationRules});

    act(()=>{
        valuesRef.current.setValue(12, 'foo');
    });

    const expectedValues = {...values, foo: 12};
    expect(valuesRef.current.values).toStrictEqual(expectedValues);
    expect(valuesRef.current.lastChanged).toStrictEqual(['foo']);
    expect(valuesRef.current.validation.valid).toBeTruthy();

    expect(onValueChange).toBeCalledWith('foo', 12, true);
    expect(onValuesChange).toBeCalledWith(expectedValues, true);
});

test('useForm change single value invalid', () => {
    const {valuesRef, onValuesChange, onValueChange} = setup({values, validationRules});

    act(()=>{
        valuesRef.current.setValue(2, 'foo');
    });

    expect(valuesRef.current.validation.valid).toBeFalsy();
    expect(onValueChange).toBeCalledWith('foo', 2, false);
    expect(onValuesChange).toBeCalledWith({...values, foo: 2}, false);
});

test('useForm change multiple values valid', () => {
    const {valuesRef, onValuesChange} = setup({values, validationRules});

    const expectedValues = {foo: 12, bar: 'changed value'};

    act(()=>{
        valuesRef.current.setValues(expectedValues);
    });

    expect(valuesRef.current.values).toStrictEqual(expectedValues);
    expect(valuesRef.current.lastChanged).toStrictEqual(['foo', 'bar']);
    expect(valuesRef.current.validation.valid).toBeTruthy();

    expect(onValuesChange).toBeCalledWith(expectedValues, true);
});

test('useForm change multiple values invalid', () => {
    const {valuesRef, onValuesChange} = setup({values, validationRules});

    const expectedValues = {foo: 2, bar: 'changed value'};

    act(()=>{
        valuesRef.current.setValues(expectedValues);
    });

    expect(valuesRef.current.validation.valid).toBeFalsy();

    expect(onValuesChange).toBeCalledWith(expectedValues, false);
});

test('useForm change from outside - invalid', () => {
    const {valuesRef, onValuesChange, onValueChange, changeProps} = setup({values, validationRules});

    // mimic outside change with invalid values
    changeProps({values: {foo: 2, bar: 'changed value'}});
    expect(valuesRef.current.validation.valid).toBeFalsy();
    expect(valuesRef.current.lastChanged).toStrictEqual(['foo', 'bar']);
    expect(onValueChange).not.toBeCalled();
    expect(onValuesChange).toBeCalled();
});

test('useForm change from outside - valid single value', () => {
    const {valuesRef, onValuesChange, onValueChange, changeProps} = setup({values, validationRules});

    // mimic outside change with valid single value
    changeProps({values: {foo: 12}});
    expect(valuesRef.current.validation.valid).toBeTruthy();
    expect(valuesRef.current.lastChanged).toStrictEqual(['foo']);
    expect(onValueChange).toBeCalled();
    expect(onValuesChange).toBeCalled();
});

test('useForm submit invalid', () => {
    const invalidValues = {...values, foo: 2};
    const {valuesRef, onSubmit} = setup({values: invalidValues, validationRules});
    valuesRef.current.handleSubmit();
    expect(onSubmit).toBeCalledWith(invalidValues, false, valuesRef.current);
});

test('useForm submit valid', () => {
    const {valuesRef, onSubmit} = setup({values, validationRules});
    valuesRef.current.handleSubmit();
    expect(onSubmit).toBeCalledWith(values, true, valuesRef.current);
});

test('useForm depend fields validation', () => {
    const validationRules = {
        depended: (values) => values.switcher === true ? {required: true} : {},
    };

    const values = {
        depended: null,
        switcher: true,
    };

    const {valuesRef, onSubmit} = setup({values, validationRules});
    act(() => {
        valuesRef.current.handleSubmit();
    });

    expect(onSubmit).toBeCalledWith(values, false, valuesRef.current);
    expect(valuesRef.current.validation.valid).toBeFalsy();
});

test('useForm depend fields validation - valid submit', () => {
    const validationRules = {
        depended: (values) => values.switcher === true ? {required: true} : {},
    };

    const values = {
        depended: null,
        switcher: false,
    };

    const {valuesRef, onSubmit} = setup({values, validationRules});
    act(() => {
        valuesRef.current.handleSubmit();
    });

    expect(onSubmit).toBeCalledWith(values, true, valuesRef.current);
    expect(valuesRef.current.validation.valid).toBeTruthy();
});

test('useForm depend fields validation - values change', () => {
    const validationRules = {
        depended: (values) => values.switcher === true ? {required: true} : {},
    };

    const values = {
        depended: null,
        switcher: true,
    };

    const {valuesRef} = setup({values, validationRules});
    expect(valuesRef.current.validation.valid).toBeFalsy();

    act(()=>{
        valuesRef.current.setValues({
            depended: null,
            switcher: false,
        });
    });
    expect(valuesRef.current.validation.valid).toBeTruthy();
});