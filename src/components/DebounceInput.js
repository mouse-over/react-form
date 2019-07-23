import React, {useState, useCallback, useEffect, useRef} from 'react';

export const DebounceInput = (props) => {

    const {debounce = 500, elementType, elementProps: inElementProps} = props;
    const {onChange, value} = inElementProps;
    const [currentEvent, setCurrentEvent] = useState({target: {value: value}});
    const [hasFocus, setHasFocus] = useState(false);

    const handleFocus = useCallback(() => {
        setHasFocus(true);
    }, []);

    const changeCallback = useCallback(() => {
        if (currentEvent) {
            onChange(currentEvent);
            setCurrentEvent(null);
        }
    }, [onChange, currentEvent, setCurrentEvent]);

    const handleBlur = useCallback(() => {
        changeCallback();
        setHasFocus(false);
    }, [changeCallback]);

    const handleChange = useCallback((event) => {
        setCurrentEvent({target: event.target});
    }, []);

    const handleKey = useCallback((event) => {
        if (event.key === "Enter") {
            changeCallback();
        }
    }, [changeCallback]);

    const debounceIntervalRef = useRef(null);

    useEffect(()=> {
        if (hasFocus && debounce) {
            debounceIntervalRef.current = setTimeout(() => {
                changeCallback();
            }, debounce);
        } else {
            changeCallback();
        }
        return () => {
            if (debounceIntervalRef.current) {
                clearTimeout(debounceIntervalRef.current);
                debounceIntervalRef.current = null;
            }
        }
    }, [changeCallback, debounce, hasFocus]);

    const elementProps = {
        ...inElementProps,
        onChange: handleChange,
        onFocus: handleFocus,
        onBlur: handleBlur,
        onKeyPress: handleKey
    };

    if (hasFocus && currentEvent && currentEvent.target) {
        elementProps.value = currentEvent.target.value;
    }

    if (elementType === 'textarea') {
        return <textarea {...elementProps}/>;
    } else {
        return <input {...elementProps}/>;
    }
};


export default DebounceInput;