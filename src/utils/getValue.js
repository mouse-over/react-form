import {getOnPath} from "./getOnPath";

export const getValue = (state, name) => {
    if (Array.isArray(name)) {
        return getOnPath(state, name);
    } else {
        return state[name];
    }
};