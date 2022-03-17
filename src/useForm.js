import {useCallback, useEffect, useMemo, useReducer, useState} from 'react';
import {updateValidationResult} from "@mouseover/js-validation";
import {useValidator} from "@mouseover/js-validation-hook";
import {mergeDeep, pathWithChildren, shallowEqual, updateValue} from "@mouseover/js-utils";
import {getValue} from "@mouseover/js-utils";

const CHANGE_FIELD_VALUE = 'change_field_value';
const CHANGE_FIELDS_VALUES = 'change_fields_values';
const CHANGE_INPUT_VALUES = 'change_input_values';
const CLEAR_FIELD_VALUE = 'reset_field';
const VALIDATE = 'validate';

const initialState = {
    values: {},
    validation: {messages: [], valid: true, children: {}},
    changes: {lastChanged: []},
    lastInputValues: {}
};

const createUpdateValuesAndValidation = (validator) => (state, name, value, valid = null) => {
    const newValues = updateValue(state.values, name, value);
    const fieldValidation = valid || validator.validateObjectField(newValues, name);
    return {
        values: newValues,
        validation: updateValidationResult(state.validation, name, fieldValidation)
    }
};

const formReducer = (validator) => {
    const updateValuesAndValidation = createUpdateValuesAndValidation(validator);
    return (state, action) => {
        switch (action.type) {
            case CHANGE_FIELD_VALUE:
                return {
                    ...state,
                    ...updateValuesAndValidation(state, action.name, action.value),
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
                    ...updateValuesAndValidation(state, action.name, null, true),
                    changes: {lastChanged: [action.name]}
                };

            case CHANGE_INPUT_VALUES:
                return {
                    ...state,
                    lastInputValues: action.values
                };

            case VALIDATE:
                return {
                    ...state,
                    validation: validator.validateObject(state.values || {})
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
        validationRules: rules,
        isSubmitted: inIsSubmitted
    } = props;

    const [isSubmitted, setIsSubmitted] = useState(inIsSubmitted);
    const [currentRules, setCurrentRules] = useState(rules || {});
    useEffect(() => {
        setCurrentRules((current) => shallowEqual(rules, current) ? current : (rules || {}));
    }, [rules, setCurrentRules])

    const validator = useValidator(currentRules);
    const memoizedReducer = useMemo(() => formReducer(validator), [validator]);
    const [state, dispatch] = useReducer(
        memoizedReducer,
        initialState
    );

    const setValueCallback = useCallback((value, name) => {
        dispatch({type: CHANGE_FIELD_VALUE, name, value});
    }, []);

    const setValuesCallback = useCallback((values) => {
        dispatch({type: CHANGE_FIELDS_VALUES, values, rules});
    }, [dispatch, rules]);

    useEffect(() => {
        if (inputValues && !shallowEqual(state.lastInputValues, inputValues)) {
            dispatch({type: CHANGE_INPUT_VALUES, values: inputValues});
            setValuesCallback(inputValues);
        }
    }, [inputValues, state.lastInputValues]);

    const {lastChanged} = state.changes;

    useEffect(() => {
        if (onValueChange && lastChanged.length === 1) {
            const name = lastChanged[0];
            const value = getValue(state.values, name);
            const validation = getValue(state.validation, pathWithChildren(name));
            onValueChange(name, value, validation ? validation.valid : null);
        }

        if (onValuesChange && lastChanged.length > 0) {
            onValuesChange(state.values, state.validation.valid);
        }

    }, [onValueChange, onValuesChange, lastChanged, state.values, state.validation]);

    useEffect(() => {
        if (validator) {
            dispatch({type: VALIDATE, values: inputValues, rules: validator.rules});
        }
    }, [inputValues, validator, dispatch]);

    useEffect(() => {
        if (inIsSubmitted) {
            setIsSubmitted(true);
        }
    }, [setIsSubmitted, inIsSubmitted]);

    const form = useMemo(() => {
        return {
            setValue: setValueCallback,
            setValues: setValuesCallback,
        }
    }, [setValueCallback, setValuesCallback]);

    form.handleSubmit = useCallback((event) => {
        if (event) {
            if (typeof event.preventDefault === 'function') {
                event.preventDefault()
            }
            if (typeof event.stopPropagation === 'function') {
                event.stopPropagation()
            }
        }
        setIsSubmitted(true);
        if (onSubmit) {
            onSubmit(state.values, state.validation.valid, form)
        }
    }, [state, onSubmit, form, setIsSubmitted]);

    form.values = state.values;
    form.defaultValues = state.lastInputValues;
    form.lastChanged = lastChanged;
    form.validation = state.validation;
    form.isSubmitted = isSubmitted;

    return form;
};