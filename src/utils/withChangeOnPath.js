export const withChangeOnPath = (object, path, value) => {

    let index = 0;
    const length = path.length;

    const result = {...object};
    let leaf = result;

    while (index < length) {
        const currentKey = path[index++];
        if (index < length) {
            leaf = leaf[currentKey] = {...(leaf[currentKey] || {})};
        } else {
            leaf[currentKey] = value;
        }
    }

    return result;
};