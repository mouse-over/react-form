import {isObject} from "@mouseover/js-validation";

export const mergeDeep = (state, values) => {
    const entries = Object.entries(values);

    if (entries.length === 0) {
        // no changes no state spreed
        return state;
    }

    const newState = {
        ...state
    };

    entries.forEach(([key, value]) => {
        if (Array.isArray(value)) {
            newState[key] = [...value];
        } else if (isObject(value)) {
            newState[key] = mergeDeep(newState[key] || {}, value);
        } else {
            newState[key] = value;
        }
    });

    return newState;
};

export default mergeDeep;