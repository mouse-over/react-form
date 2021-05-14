import React from 'react';
import {act, cleanup, render} from "@testing-library/react";
import setup from "./setup";
import {useForm, useFormContainer} from "../src";

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

const FakeComponent = ({children, props}) => children(useForm(props));
const setupFormContainer = (props) => {
    const onValueChange = jest.fn();
    const onValuesChange = jest.fn();
    const onSubmit = jest.fn();
    const returnVal = {current: null, container: null};
    const finalProps = {...props, onValueChange, onValuesChange, onSubmit};

    const Component = ({props}) => <FakeComponent props={props}>
        {
            (form) => {
                returnVal.current = form;
                returnVal.container = useFormContainer(props.path, form);
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


test('useFormContainer output check', () => {
    const {valuesRef, onValuesChange, onValueChange, changeProps} = setupFormContainer({values, validationRules, path: 'container'});
    expect(valuesRef.current.validation.valid).toBeTruthy();
    expect(valuesRef.current.lastChanged).toStrictEqual(['container']);
    expect(valuesRef.container.values).toStrictEqual(values.container);
    expect(valuesRef.container.validation.valid).toBeTruthy();
    expect(valuesRef.container.validation.children).toStrictEqual({
        "bar": {
            "messages": [],
            "valid": true
        },
        "foo": {
            "messages": [],
            "valid": true
        }
    });
    expect(valuesRef.container.defaultValues).toStrictEqual(values.container);
});

test('useFormContainer setValue', () => {
    const {valuesRef, onValuesChange, onValueChange} = setupFormContainer({values, validationRules, path: 'container'});

    act(() => {
        valuesRef.container.setValue(12, 'foo');
    });

    const expectedValues = {...values, container: {...values.container, foo: 12}};

    expect(valuesRef.current.values).toStrictEqual(expectedValues);
    expect(valuesRef.current.lastChanged).toStrictEqual([["container", "foo"]]);
    expect(valuesRef.current.validation.valid).toBeTruthy();
    expect(valuesRef.container.defaultValues).toStrictEqual(values.container);
    expect(valuesRef.container.values).toStrictEqual(expectedValues.container);

    expect(onValueChange).toBeCalledWith(['container', 'foo'], 12, true);
    expect(onValuesChange).toBeCalledWith(expectedValues, true);
});

test('useFormContainer setValues', () => {
    const {valuesRef, onValuesChange} = setupFormContainer({values, validationRules, path: 'container'});
    expect(valuesRef.current.validation.valid).toBeTruthy();
    act(() => {
        valuesRef.container.setValues({foo: 2, bar: 'changed value'});
    });
    expect(valuesRef.current.validation.valid).toBeFalsy();
});

test('useFormContainer submit', () => {
    const {valuesRef, onSubmit} = setupFormContainer({values, validationRules, path: 'container'});
    act(()=> {
        valuesRef.container.handleSubmit();
    });
    expect(onSubmit).toBeCalledWith(values, true, valuesRef.current);
});
