import {useInput} from "../useInput";
import React from "react";
import DebounceInput from "./DebounceInput";
import {InfoMessage, ValidationMessages, InputAddons, GroupContainer, CheckboxFieldGroup, InputFieldGroup} from "./../components/field";
import {Checkbox} from "./../components/input";

const createElementClasses = ({elementType, touched, valid, className}) => {
    let inputClasses = [];

    if (className) {
        inputClasses.push('className');
    }

    if (elementType !== 'checkbox') {
        inputClasses.push('form-control');
    }

    if (touched) {
        inputClasses.push('touched');
    }

    if (!valid) {
        inputClasses.push('invalid');
    }
    return inputClasses;
};

const createElementProps = ({inputClasses, elementConfig, element}) => ({
    className: inputClasses.join(' '),
    ...elementConfig,
    ...element
});

const renderLabelElement = ({label}) => label ? <label>{label}</label> : null;

const renderMessageElement = ({message}) => (message
        ? (typeof message === 'function' ? message() : <InfoMessage>{message}</InfoMessage>)
        : null
);
const renderValidationMessages = ({messages, touched}) => messages && touched ? <ValidationMessages messages={messages}/> : null;

const renderInputElement = (props, elementProps) => {
    switch (props.elementType) {
        case ('select'):
            const {options = []} = props;
            return (<select {...elementProps}>
                {options.map((option, key) => (
                    <option
                        key={key}
                        value={option.value}>{option.label}</option>
                ))}
            </select>);

        case ('checkbox'):
            return (<Checkbox {...elementProps} label={props.label}/>);

        case ('input'):
        case ('textarea'):
        default:
            return (<DebounceInput {...props} elementProps={elementProps}/>);
    }
};

const renderContent = (props, {validationMessages, messageElement, labelElement, inputElement}) => {
    if (props.elementType === 'checkbox') {
        return <CheckboxFieldGroup
            label={props.label}
            messageElement={messageElement}
            validationError={validationMessages}>{inputElement}</CheckboxFieldGroup>;
    } else {
        return <InputFieldGroup
            labelElement={labelElement}
            messageElement={messageElement}
            validationError={validationMessages}><InputAddons {...props}>{inputElement}</InputAddons></InputFieldGroup>;
    }
};

const determineRenderMethods = (props) => ({
    renderInputElement: props.renderInputElement || renderInputElement,
    renderValidationMessages: props.renderValidationMessages || renderValidationMessages,
    renderLabelElement: props.renderLabelElement || renderLabelElement,
    renderMessageElement: props.renderMessageElement || renderMessageElement
});

export const FieldGroup = (props) => {
    if (props.elementType === 'heading') {
        return <h3>{props.label}</h3>;
    }
    return <FieldGroupContent {...props}/>;
};

const FieldGroupContent = (props) => {

    const {
        name,
        elementType,
        valueType,
        onChange,
        groupClass = 'form-group',
        elementConfig = {},
        value: inValue,
        defaultValue,
        validation,
        render,
        groupContainer
    } = props;

    const input = useInput({
        name,
        onChange,
        value: inValue,
        defaultValue,
        valueType,
        validation
    });

    const {touched, element, valid} = input;

    const inputClasses = createElementClasses({elementType, touched, valid});
    const elementProps = createElementProps({element, elementConfig, inputClasses});

    const renders = determineRenderMethods(props);
    const inputElement = renders.renderInputElement(props, elementProps, input);
    const validationMessages = renders.renderValidationMessages(input);
    const labelElement = renders.renderLabelElement(props);
    const messageElement = renders.renderMessageElement(props);
    const Container = groupContainer || GroupContainer;

    return <Container className={groupClass}>
        {(render || renderContent)(props, {validationMessages, messageElement, labelElement, inputElement})}
    </Container>;
};

export default FieldGroup;