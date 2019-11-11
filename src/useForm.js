import {useCallback, useEffect, useMemo, useReducer} from 'react';
import {updateValidationResult} from "@mouseover/js-validation";
import {useValidator} from "@mouseover/js-validation-hook";
import {mergeDeep, shallowEqual, updateValue} from "@mouseover/js-utils";

const CHANGE_FIELD_VALUE = 'change_field_value';
const CHANGE_FIELDS_VALUES = 'change_fields_values';
const CHANGE_FROM_OUTSIDE = 'change_from_outside';
const CLEAR_FIELD_VALUE = 'reset_field';

const initialState = {
    values: {},
    validation: {messages: [], valid: true, children: {}},
    changes: {lastChanged: []},
    lastInputValues: {}
};

const formReducer = (validator) => {
    return (state, action) => {
        switch (action.type) {
            case CHANGE_FIELD_VALUE:
                return {
                    ...state,
                    values: updateValue(state.values, action.name, action.value),
                    validation: updateValidationResult(state.validation, action.name, action.validation),
                    changes: {lastChanged: [action.name]}
                };

            case CHANGE_FIELDS_VALUES:
                const newValues = mergeDeep(state.values, action.values);
                return {
                    ...state,
                    values: newValues,
                    validation: validator.validateObject(newValues),
                    changes: {lastChanged: Object.keys(action.values)}
                };

            case CLEAR_FIELD_VALUE:
                return {
                    ...state,
                    values: updateValue(state.values, action.name, null),
                    validation: updateValidationResult(state.validation, action.name, true),
                    changes: {lastChanged: [action.name]}
                };

            case CHANGE_FROM_OUTSIDE:
                let lastInputValues = state.lastInputValues;

                for (let name in action.values) {
                    if (action.values.hasOwnProperty(name)) {
                        const value = action.values[name];
                        lastInputValues = updateValue(lastInputValues, name, value);
                    }
                }

                return {
                    ...state,
                    lastInputValues
                };
            default:
                return state;
        }
    };
};

export const useForm = (props) => {
    const {
        values: inputValues,
        onValueChange,
        onValuesChange,
        onSubmit,
        validationRules: rules
    } = props;

    const validator = useValidator(rules);
    const memoizedReducer = useMemo(() => formReducer(validator), [validator]);
    const [state, dispatch] = useReducer(
        memoizedReducer,
        initialState
    );

    const validateAndDispatchNewValue = useCallback((name, value) => {
        const validation = validator.validateField(value, name);
        dispatch({type: CHANGE_FIELD_VALUE, name, value, validation});
    }, [validator]);

    const setValueCallback = useCallback((value, name) => {
            validateAndDispatchNewValue(name, value);
    }, [validateAndDispatchNewValue]);

    const setValuesCallback = useCallback((values) => {
        dispatch({type: CHANGE_FIELDS_VALUES, values, rules});
    }, [dispatch, rules]);

    const handleSubmit = useCallback((event) => {
        if (event) {
            if (typeof event.preventDefault === 'function') {
                event.preventDefault()
            }
            if (typeof event.stopPropagation === 'function') {
                event.stopPropagation()
            }
        }
        if (onSubmit) {
            onSubmit(state.values, state.validation.valid)
        }
    }, [state, onSubmit]);

    useEffect(() => {
        if (inputValues && !shallowEqual(state.lastInputValues, inputValues)) {
            dispatch({type: CHANGE_FROM_OUTSIDE, values: inputValues});
            setValuesCallback(inputValues);
        }
    }, [inputValues, state.lastInputValues]);

    const {lastChanged} = state.changes;

    useEffect(() => {
        if (onValueChange && lastChanged.length === 1) {
            const name = lastChanged[0];
            const value = state.values[name];
            onValueChange(name, value, state.validation.children[name] ? state.validation.children[name].valid : null);
        }

        if (onValuesChange && lastChanged.length > 0) {
            onValuesChange(state.values, state.validation.valid);
        }

    }, [onValueChange, onValuesChange, lastChanged, state.values, state.validation]);

    const form = useMemo(() => {
        return {
            setValue: setValueCallback,
            setValues: setValuesCallback,
        }
    }, [setValueCallback, setValuesCallback]);

    form.handleSubmit = handleSubmit;
    form.values = state.values;
    form.defaultValues = state.lastInputValues;
    form.lastChanged = lastChanged;
    form.validation = state.validation;

    return form;
};