import {useInput} from "../useInput";
import React from "react";
import DebounceInput from "./DebounceInput";

const InputAddons = ({children, renderAppend = null, renderPrepend = null}) => {
    if (!renderAppend && !renderPrepend) {
        return children;
    }
    return (<div className="input-group">
            {renderPrepend ? renderPrepend() : null}
            {children}
            {renderAppend ? renderAppend() : null}
        </div>);
};
export const Input = (props) => {
    const {
        name,
        label = null,
        elementType = 'text',
        valueType = 'text',
        onChange,
        groupClass = 'form-group',
        elementConfig = {},
        value: inValue,
        defaultValue,
        validation
    } = props;

    const {touched, element, valid, messages} = useInput({
        name,
        onChange,
        value: inValue,
        defaultValue,
        valueType,
        validation
    });

    let inputElement = null;
    let inputClasses = [];

    if (elementType === 'heading') {
        return <h3>{label}</h3>;
    }

    if (elementType !== 'checkbox') {
        inputClasses.push('form-control');
    }

    if (touched !== false && (!valid)) {
        inputClasses.push('invalid');
    }

    const elementProps = {
        className: inputClasses.join(' '),
        ...elementConfig,
        ...element,
    };

    switch (elementType) {
        case ('textarea'):
            inputElement = <DebounceInput {...props} elementProps={elementProps}/>;
            break;

        case ('select'):
            const {options = []} = elementProps;
            inputElement = (<select {...elementProps}>
                {options.map((option, key) => (
                    <option
                        key={key}
                        value={option.value}>{option.label}</option>
                ))}
            </select>);
            break;

        case ('checkbox'):
            elementProps.type = 'checkbox';
            elementProps.checked = elementProps.value;
            delete elementProps.value;
            inputElement = (<input {...elementProps}/>);
            break;

        case ('input'):
        default:
            inputElement = (<DebounceInput {...props} elementProps={elementProps}/>);
            break;
    }

    let validationError = null;
    if (messages && touched) {
        validationError = messages.map((message, index) => <p key={`message_${index}`} className='alert-error'>{message}</p>);
    }

    let labelElement = null;
    if (label) {
        labelElement = <label>{label}</label>;
    }

    let messageElement = null;
    if (props.message) {
        messageElement = typeof props.message === 'function' ? props.message() : <p className='alert-info'>{props.message}</p>
    }

    let body = (
        <div className={groupClass}>
            {labelElement}
            <InputAddons {...props}>{inputElement}</InputAddons>
            {messageElement}
            {validationError}
        </div>
    );

    if (elementType === 'checkbox') {
        body = (
            <div className={groupClass}>
                <label>
                    {inputElement}&nbsp;{label}
                </label>
                {messageElement}
                {validationError}
            </div>
        );
    }


    return body;
};

export default Input;