import React from 'react';

import {cleanup, render, fireEvent, act} from "@testing-library/react";
import {DebounceInput} from "../../src/components";

jest.useFakeTimers();
afterEach(cleanup);

const props = {
    debounce: 10,
    elementType: 'text',
    elementProps: {
        name: 'name',
        value: 'value',
        'data-testid': 'test-input'
    }
};

const setup = (props) => {
    const output = render(<DebounceInput {...props}/>);
    const element = output.getByTestId('test-input');
    return {
        element,
        ...output,
        changeProps: (changedProps) => output.rerender(<DebounceInput {...{...props, ...changedProps}}/>)
    }
};

test('DebounceInput focused with debounce', async () => {
    const onChangeMock = jest.fn();
    const {element} = setup({...props, elementProps: {...props.elementProps, onChange: onChangeMock}});
    expect(element.value).toBe('value');
    //- must be focused
    fireEvent.focus(element);
    //- changed
    fireEvent.change(element, {target: {value: 'changed'}});
    //- debouncing is set so we must run timers to probe
    act(() => jest.runOnlyPendingTimers());
    //- onChange triggered
    expect(onChangeMock.mock.calls.length).toBe(1);
});

test('DebounceInput focused without debounce', async () => {
    const onChangeMock = jest.fn();
    const {element} = setup({...props, debounce: null, elementProps: {...props.elementProps, onChange: onChangeMock}});
    expect(element.value).toBe('value');
    fireEvent.focus(element);
    fireEvent.change(element, {target: {value: 'changed'}});
    //- no timers, just trigger it directly
    expect(onChangeMock.mock.calls.length).toBe(1);
});

test('DebounceInput unfocused with debounce', async () => {
    const onChangeMock = jest.fn();
    const {element} = setup({...props, debounce: 100, elementProps: {...props.elementProps, onChange: onChangeMock}});
    expect(element.value).toBe('value');
    fireEvent.change(element, {target: {value: 'changed'}});
    //- no timeout, just trigger it directly
    expect(onChangeMock.mock.calls.length).toBe(1);
});

test('DebounceInput value change', () => {
    const {element, changeProps} = setup(props);
    changeProps({elementProps: {value: 'changed'}});
    expect(element.value).toBe('changed');
});