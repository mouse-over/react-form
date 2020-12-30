import {render} from "@testing-library/react";
import React from "react";
import {useForm} from "../src";

const FakeComponent = ({children, props}) => children(useForm(props));

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

export default setup;