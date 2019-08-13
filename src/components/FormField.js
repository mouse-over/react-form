import React from 'react';
import Input from "./Input";
import {getValue} from "./../utils";

export const FormField = (props) => {
    const {form, name} = props;
    const {values = {}, validation = {}, defaultValues = {}, setValue} = form;
    return (<Input
        {...props}
        name={name}
        value={getValue(values, name)}
        validation={getValue(validation, name)}
        defaultValue={getValue(defaultValues, name)}
        onChange={setValue}
    />);
};

export default FormField;