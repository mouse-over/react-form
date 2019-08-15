export const mutateOnPath = (object, path, value) => {
    let leaf = object;
    let index = 0;
    const length = path.length;

    while (index < length) {
        const currentKey = path[index++];
        if (index < length) {
            leaf = leaf[currentKey] = leaf[currentKey] || {};
        } else {
            leaf[currentKey] = value;
        }
    }
};

