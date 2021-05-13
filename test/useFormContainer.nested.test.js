import {useForm, useFormContainer} from "../src";
import {act, render} from "@testing-library/react";
import React from "react";

const FakeComponent = ({children, props}) => children(useForm(props));
const setupFake = (props) => {
    const onValueChange = jest.fn();
    const onValuesChange = jest.fn();
    const onSubmit = jest.fn();
    const returnVal = {current: null, container: null};
    const finalProps = {...props, onValueChange, onValuesChange, onSubmit};

    const Component = ({props}) => <FakeComponent props={props}>
        {
            (form) => {
                returnVal.current = form;
                returnVal.container = useFormContainer('container', returnVal.current);
                returnVal.childContainer = useFormContainer('childContainer', returnVal.container);
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


test('useFormContainer nested containers', () => {
    const validationRules = {
        container: {
            children: {
                childContainer: {
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
            }
        }
    };

    const values = {
        container: {
            childContainer: {
                foo: 20,
                bar: 'bar'
            }
        }
    };
    const {valuesRef} = setupFake({values, validationRules});

    expect(valuesRef.current.validation.valid).toBeTruthy();
    act(() => {
        valuesRef.childContainer.setValues({foo: 2});
    });

    const expectedValues = {...values, container: {childContainer: {...values.container.childContainer, foo: 2}}};

    expect(valuesRef.current.validation.valid).toBeFalsy();
    expect(valuesRef.current.values).toStrictEqual(expectedValues);
    expect(valuesRef.container.values).toStrictEqual(expectedValues.container);
});
