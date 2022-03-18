import React from 'react';

import {cleanup, render} from "@testing-library/react";
import {Form} from "../../src/components";
import {act} from "react-dom/test-utils";

afterEach(cleanup);

const setup = (props) => {
    const output = render(<Form {...props} data-testid='test-form'/>);
    const element = output.getByTestId('test-form');
    return {
        element,
        ...output,
        changeProps: (changedProps) => output.rerender(<Form {...{...props, ...changedProps}}/>)
    }
};

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

test('Form creation', () => {
    const {changeProps} = setup({values});
    act(() => {
        changeProps({isSubmitted: true});
    });

    act(() => {
        changeProps({validationRules});
    })


});