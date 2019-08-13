export const updateValue = (state, name, value) => {
    if (Array.isArray(name)) {
        const path = [...name];
        const current = path.shift();

        if (path.length === 0) {
            return updateValue(state, current, value);
        } else {
            const currentState = state[current] || {};

            return {...state, [current]: updateValue(currentState, path, value)};
        }
    } else {
        return {...state, [name]: value};
    }
};