import React from 'react';

import {cleanup, render, fireEvent} from "@testing-library/react";
import {FormField} from "../../src/components";

afterEach(cleanup);

const props = {
    name: 'name',
    label: 'label',
    elementConfig: {'data-testid': 'test-input'}
};

const setup = (props) => {
    const output = render(<FormField {...props}/>);
    const element = output.getByTestId('test-input');
    return {
        element,
        ...output,
        changeProps: (changedProps) => output.rerender(<FormField {...{...props, ...changedProps}}/>)
    }
};


test('FormField basic operations', () => {
    const form = {
        values: {'name': 'value'},
        defaultValues: {'name': 'default'},
        validation: {'name': {valid: true, messages: []}},
        setValue: jest.fn()
    };

    const {element, changeProps} = setup({...props, form});

    expect(element.value).toBe('value');


    //- mimic change event on input
    fireEvent.change(element, {target: {value: 'changed value'}});

    //- setValue should be called
    expect(form.setValue.mock.calls.length).toBe(1);

    //- refresh props as result of change
    changeProps({form: {...form, values: {name: 'changed value'}}});

    //- to se if it changed on input
    expect(element.value).toBe('changed value');
});


test('FormField use validation and defaultValues', () => {
    const form = {
        values: {'name': 'value'},
        defaultValues: {'name': 'default'},
        validation: {'name': {valid: true, messages: []}},
        setValue: jest.fn()
    };

    const {element, getByText, changeProps} = setup({...props, form});

    fireEvent.change(element, {target: {value: 'changed value'}});
    expect(form.setValue.mock.calls.length).toBe(1);

    changeProps({
        form: {
            ...form,
            values: {name: 'changed value'},
            validation: {children: {'name': {valid: false, messages: ['error']}}}
        }
    });

    expect(element.value).toBe('changed value');

    // if error message is displayed then input is invalid and touched
    expect(getByText('error')).toBeDefined();
});
