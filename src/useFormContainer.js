export const useFormContainer = (containerName, form) => {
    const {values = {}, validation = {}, defaultValues = {}, setValue, handleSubmit} = form;

    return {
        values: values[containerName] || {},
        setValue: (value, name) => setValue(value, [containerName, name]),
        validation: validation[containerName] ? validation[containerName].children : {children: {}, valid: true},
        defaultValues: defaultValues[containerName] || {},
        setValues: (values) => {
            for (let name in values) {
                if (values.hasOwnProperty(name)) {
                    setValue([containerName, name], values[name]);
                }
            }
        },
        handleSubmit
    }
};