import React, {useState, useCallback, useEffect, useRef} from 'react';

export const DebounceInput = (props) => {

    const {debounce = 500, elementType, elementProps: inElementProps} = props;
    const {onChange} = inElementProps;
    const [currentEvent, setCurrentEvent] = useState(null);
    const [hasFocus, setHasFocus] = useState(false);
    const [propagate, setPropagate] = useState(false);

    const handleFocus = useCallback(() => {
        setHasFocus(true);
    }, []);

    const handleBlur = useCallback(() => {
        if (currentEvent) {
            onChange(currentEvent);
            setCurrentEvent(null);
            setPropagate(false);
        }
        setHasFocus(false);
    }, [currentEvent]);

    useEffect(() => {
        if (currentEvent && propagate) {
            onChange(currentEvent);
            setCurrentEvent(null);
            setPropagate(false);
        }
    }, [currentEvent, propagate]);

    const handleChange = useCallback((event) => {
        setCurrentEvent({target: event.target});
        if (!debounce) {
            setPropagate(true);
        }
    }, [debounce]);

    const handleKey = useCallback((event) => {
        if (event.key === "Enter") {
            onChange(event);
            setCurrentEvent(null);
            setPropagate(false);
        }
    }, [currentEvent]);

    const debounceIntervalRef = useRef(null);

    useEffect(()=> {
        if (currentEvent) {
            if (hasFocus && debounce) {
                debounceIntervalRef.current = setTimeout(() => {
                    if (hasFocus) {
                        setPropagate(true);
                    }
                }, debounce);
            } else if (debounce) {
                setPropagate(true);
            }
        }
        return () => {
            if (debounceIntervalRef.current) {
                clearTimeout(debounceIntervalRef.current);
                debounceIntervalRef.current = null;
            }
        }
    }, [debounce, hasFocus, currentEvent]);

    const elementProps = {
        ...inElementProps,
        onChange: handleChange,
        onFocus: handleFocus,
        onBlur: handleBlur,
        onKeyDown: handleKey
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