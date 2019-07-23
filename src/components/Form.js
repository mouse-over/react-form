import React, {useEffect, useState} from 'react';
import {useForm} from "../useForm";
import {FormField} from "./FormField";
import {shallowEqual} from "../utils";

const controlsToList = (controls) => {
    const formElementsArray = [];

    for (let key in controls) {
        if (controls.hasOwnProperty(key)) {
            formElementsArray.push({...controls[key], key: key});
        }
    }

    return formElementsArray;
};

const controlsToValidationRules = (controls) => {
    const rules = {};

    for (let key in controls) {
        if (controls.hasOwnProperty(key)) {
            rules[key] = controls[key].validation || null;
        }
    }

    return rules;
};


const mapInput = (form, defaultGroupClass) => (input) => {
    if (input.visible && !input.visible(form.values)) {
        return null;
    }
    return (<FormField
            form={form}
            key={input.key}
            name={input.key}
            elementType={input.elementType}
            elementConfig={input.elementConfig}
            label={input.label}
            groupClass={input.groupClass ? input.groupClass : defaultGroupClass}
        />
    );
};


export const Form = ({className = 'form', controls, defaultGroupClass = 'form-group', validationRules: inputValidationRules, values: inDefaultValues, onChange, onSubmit, children, render}) => {

    const [defaultValues, setDefaultValues] = useState({});
    const [validationRules, setValidationRules] = useState(inputValidationRules);

    useEffect(() => {
        if (!shallowEqual(inDefaultValues, defaultValues)) {
            setDefaultValues(inDefaultValues);
        }
    }, [inDefaultValues, defaultValues]);

    useEffect(() => {
        if (controls) {
            const rules = controlsToValidationRules(controls);
            setValidationRules(rules);
        }
    }, [controls]);

    const form = useForm({
            values: defaultValues,
            onValuesChange: onChange,
            onSubmit,
            validationRules
        }
    );

    return (<form onSubmit={form.handleSubmit} className={className}>
        {controlsToList(controls).map(mapInput(form, defaultGroupClass))}
        {render ? render(form) : null}
        {children}
    </form>);
};

export default Form;