import React from 'react';
import Input from "./Input";

export const FormField = (props) => {
    const {form, name} = props;
    const {values = {}, validation = {}, defaultValues = {}, setValue} = form;
    return (<Input
        {...props}
        name={name}
        value={values.hasOwnProperty(name) ? values[name] : null}
        validation={validation.hasOwnProperty(name) ? validation[name] : null}
        defaultValue={defaultValues && defaultValues.hasOwnProperty(name) ? defaultValues[name] : null}
        onChange={setValue}
    />);
};

export default FormField;