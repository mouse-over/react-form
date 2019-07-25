import React from 'react';

import {cleanup, render, fireEvent} from "@testing-library/react";
import {Input} from "../../src/components";

afterEach(cleanup);

const props = {
    name: 'name',
    label: 'label',
    value: 'value',
    elementConfig: {'data-testid': 'test-input'}
};

const setup = (props) => {
    const output = render(<Input {...props}/>);
    const inputElement = output.getByTestId('test-input');
    return {
        inputElement,
        ...output,
        changeProps: (changedProps) => output.rerender(<Input {...{...props, ...changedProps}}/>)
    }
};

test('Render Input', () => {
    const {inputElement, getByText} = setup(props);
    expect(getByText('label')).toBeDefined();
    expect(inputElement.value).toBe('value');
});

test('Render Input with append and prepend', () => {
    const {getByText} = setup({
        ...props,
        renderPrepend: () => <div>PREPEND</div>,
        renderAppend: () => <div>APPEND</div>,
    });
    expect(getByText('APPEND')).toBeDefined();
    expect(getByText('PREPEND')).toBeDefined();
});

test('Render Input with value change', () => {
    const {inputElement, changeProps} = setup(props);

    // mimic value change
    changeProps({value: 'changed value'});

    expect(inputElement.value).toBe('changed value');
});

test('Render Input with failed validation', () => {
    const {inputElement, getByText, changeProps} = setup({...props, debounce: null});

    expect(getByText('label')).toBeDefined();
    expect(inputElement.value).toBe('value');

    //- mimic change event on input - so input will be touched
    fireEvent.change(inputElement, {target: {value: 'changed value'}});

    // mimic value change to change value
    changeProps({value: "changed value", validation: {valid: false, messages: ['error']}});

    // if error message is displayed then input is invalid and touched
    expect(getByText('error')).toBeDefined();
});

test('Render checkbox', () => {
    const {getByText, inputElement, changeProps} = setup({...props, value: true, elementType: "checkbox"});
    // has label
    expect(getByText('label')).toBeDefined();

    expect(inputElement.checked).toEqual(true);

    //- mimic change event on input - so input will be touched
    fireEvent.change(inputElement, {target: {value: false}});

    // mimic value change to change value
    changeProps({value: false});

    expect(inputElement.checked).toEqual(false);
});


test('Render select', () => {
    const {getByText, inputElement, changeProps} = setup({
        ...props,
        value: null,
        elementType: "select",
        options: [
            {value: 'one', label: 'One'},
            {value: 'two', label: 'Two'},
            {value: 'three', label: 'Three'},
        ]
    });

    expect(getByText('label')).toBeDefined();
    expect(getByText('One')).toBeDefined();
    expect(getByText('Two')).toBeDefined();
    expect(getByText('Three')).toBeDefined();

    fireEvent.change(inputElement, {target: {value: 'two'}});

    changeProps({value: 'two'});

    expect(inputElement.value).toEqual('two');

    changeProps({value: 'one'});

    expect(inputElement.value).toEqual('one');
});

test('Render textarea', () => {
    const {inputElement, getByText} = setup({...props, elementType: 'textarea'});
    expect(getByText('label')).toBeDefined();
    expect(inputElement.value).toBe('value');
});


