import React from 'react';
import FieldGroup from "./FieldGroup";
import {getValue, pathWithChildren} from "@mouseover/js-utils";

export const FormField = (props) => {
    const {form, name} = props;
    const {values = {}, validation = {}, defaultValues = {}, setValue} = form;
    return (<FieldGroup
        {...props}
        name={name}
        value={getValue(values, name)}
        validation={getValue(validation, pathWithChildren(name))}
        defaultValue={getValue(defaultValues, name)}
        onChange={setValue}
    />);
};

export default FormField;