export const getValue = (state, name) => {
    if (Array.isArray(name)) {
        const path = [...name];
        const current = path.shift();
        if (path.length === 0) {
            return getValue(state, current);
        } else {
            const currentState = state[current] || {};
            return getValue(currentState, path);
        }
    } else {
        return state[name];
    }
};