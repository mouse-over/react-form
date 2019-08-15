export const getOnPath = (object, path) => {
    let leaf = object;
    let index = 0;
    const length = path.length;

    while (leaf !== null && index < length) {
        leaf = leaf[path[index++]] || null;
    }

    return leaf;
};