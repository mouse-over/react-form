import {getValue, pathWithChildren} from "@mouseover/js-utils";
import {useMemo} from "react";

export const useFormContainer = (path, form) => {
    const {values = {}, validation = {}, defaultValues = {}, setValue, handleSubmit} = form;
    const pathMemo = useMemo(() => Array.isArray(path) ? path : [path], [path]);
    return {
        values: getValue(values, pathMemo) || {},
        setValue: (value, name) => setValue(value, [...pathMemo, name]),
        validation: getValue(validation, pathWithChildren(pathMemo)) || {children: {}, valid: true},
        defaultValues: getValue(defaultValues, pathMemo) || {},
        setValues: (values) => {
            for (let name in values) {
                if (values.hasOwnProperty(name)) {
                    setValue(values[name], [...pathMemo, name]);
                }
            }
        },
        handleSubmit
    }
};