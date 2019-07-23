import React from 'react';
import {useInput} from "../src";
import {act, cleanup, render} from "@testing-library/react";

const InputComponent = ({children, props}) => children(useInput(props));


const setup = (props) => {
    const returnVal = {current: null};
    render(<InputComponent props={props}>
        {
            (output) => {
                returnVal.current = output;
                return null;
            }
        }
    </InputComponent>);
    return returnVal;
};

afterEach(cleanup);

test('useInput same values and defaultValues', () => {

    const result = setup( {
        name: 'test',
        onChange: null,
        value: "value",
        defaultValue: "value",
        valueType: 'text',
        validation: null
    });


    expect(result.current.touched).toBeFalsy();
    expect(result.current.element).toBeDefined();
    expect(result.current.element.value).toBe('value');
    expect(result.current.element.onChange).toBeDefined();
    expect(result.current.element.name).toBe('test');
    expect(result.current.defaultValue).toBe('value');
});

test('useInput with undefined defaultValue', () => {

    const result = setup( {
        name: 'test',
        value: "value",
    });

    expect(result.current.touched).toBeFalsy();
    expect(result.current.defaultValue).toBeUndefined();

    //- should change after first touche
    act(() => {
        result.current.element.onChange({target: {value: "newValue"}});
    });

    expect(result.current.touched).toBeTruthy();
});


test('useInput touched after change', () => {

    const result = setup( {
        name: 'test',
        onChange: null,
        value: "changedValue",
        defaultValue: "value",
        valueType: 'text',
        validation: null
    });

    // first render not touched, even if not same values
    expect(result.current.touched).toBeFalsy();

    act(() => {
        result.current.element.onChange({target: {value: "default"}});
    });

    // after change is touched because are not the same
    expect(result.current.touched).toBeTruthy();
    expect(result.current.element.value).toBe('changedValue');
    expect(result.current.defaultValue).toBe('value');
});

test('useInput onChange invoked', () => {
    const onChangeMock = jest.fn();

    const result = setup({
        name: 'test',
        onChange: onChangeMock,
        value: "value",
        defaultValue: "default",
        valueType: 'text',
        validation: null
    });

    act(() => {
        result.current.element.onChange({target: {value: "default"}});
    });

    expect(onChangeMock).toBeCalledWith("default", "test");
    expect(onChangeMock.mock.calls.length).toBe(1);
});


test('useInput empty integer must be null on change but 0 is not null', () => {
    const onChangeMock = jest.fn();

    const result = setup({
        name: 'test',
        onChange: onChangeMock,
        valueType: 'integer'
    });

    act(() => {
        result.current.element.onChange({target: {value: ""}});
    });

    expect(onChangeMock).toBeCalledWith(null, "test");

    act(() => {
        result.current.element.onChange({target: {value: 0}});
    });

    expect(onChangeMock).toBeCalledWith(0, "test");

    act(() => {
        result.current.element.onChange({target: {}});
    });

    expect(onChangeMock).toBeCalledWith(null, "test");
});


test('useInput empty float must be null on change but 0 is not null', () => {
    const onChangeMock = jest.fn();

    const result = setup({
        name: 'test',
        onChange: onChangeMock,
        valueType: 'float'
    });

    act(() => {
        result.current.element.onChange({target: {value: ""}});
    });

    expect(onChangeMock).toBeCalledWith(null, "test");

    act(() => {
        result.current.element.onChange({target: {value: 0.0}});
    });

    expect(onChangeMock).toBeCalledWith(0.0, "test");
});

test('useInput empty number must be null on change but 0 is not null', () => {
    const onChangeMock = jest.fn();

    const result = setup({
        name: 'test',
        onChange: onChangeMock,
        valueType: 'number'
    });

    act(() => {
        result.current.element.onChange({target: {value: ""}});
    });

    expect(onChangeMock).toBeCalledWith(null, "test");

    act(() => {
        result.current.element.onChange({target: {value: 0}});
    });

    expect(onChangeMock).toBeCalledWith(0, "test");
});

test('useInput empty value must be null on change', () => {
    const onChangeMock = jest.fn();

    const result = setup({
        name: 'test',
        onChange: onChangeMock,
        valueType: 'foo'
    });

    act(() => {
        result.current.element.onChange({target: {value: ""}});
    });

    expect(onChangeMock).toBeCalledWith(null, "test");

    act(() => {
        result.current.element.onChange({target: {value: 0}});
    });

    expect(onChangeMock).toBeCalledWith(0, "test");

    act(() => {
        result.current.element.onChange({target: {value: "    "}});
    });

    expect(onChangeMock).toBeCalledWith(null, "test");
});




