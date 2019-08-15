import {withChangeOnPath} from "./withChangeOnPath";

export const updateValue = (state, name, value) => {
    if (Array.isArray(name)) {
        return withChangeOnPath(state, name, value);
    } else {
        return {...state, [name]: value};
    }
};