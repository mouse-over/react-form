import {useState, useCallback, useEffect} from 'react';
import {parseFloatOrNull, parseIntOrNull} from "@mouseover/js-utils";
import {isEmpty} from "@mouseover/js-utils";

const readValueFromEvent = (event) => {
    if (!event || !event.target) {
        return event
    } else if (event.target.type === 'checkbox') {
        return event.target.checked;
    }

    return event.target.value;
};

const useValue = (currentValue, valueType, changeCallback) => {

    const setValue = useCallback((value) => {
        switch (valueType) {
            case 'integer':
                value = parseIntOrNull(value);
                break;
            case 'number':
            case 'float':
                value = parseFloatOrNull(value);
                break;
            default:
                if (isEmpty(value)) {
                    value = null;
                }
                break;
        }

     //   if (currentValue !== value) {
            changeCallback(value);
     //   }
    }, [valueType, changeCallback, currentValue]);

    return [currentValue, setValue];
};

export const useInput = (props) => {

    const {
        name,
        onChange,
        valueType,
        value: currentValue,
        defaultValue,
        validation,
        isSubmitted
    } = props;

    const [touched, setTouched] = useState(false);

    const changeCallback = useCallback((changedValue) => {
        if (onChange) {
            onChange(changedValue, name);
        }

        setTouched(true);//changedValue !== defaultValue);
    }, [name, onChange, defaultValue]);

    useEffect(() => {
        if (isSubmitted) {
            setTouched(true);
        }
    }, [isSubmitted, setTouched]);

    const [value, setValue] = useValue(currentValue, valueType, changeCallback);

    const setValueCallback = useCallback(
        (event) => setValue(readValueFromEvent(event)),
        [setValue, currentValue]
    );

    return {
        value,
        touched,
        valid: validation && validation.valid !== undefined? validation.valid : true,
        messages: validation && validation.messages ? validation.messages : [],
        defaultValue,
        setValue,
        element: {
            name,
            value: !isEmpty(value) ? value : '',
            onChange: setValueCallback,
        }
    };
};