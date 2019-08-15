export const pathWithChildren = (path, childrenKey = 'children') => {
    return Array.isArray(path)
        ? path.reduce((newPath, current) => newPath.concat(childrenKey,current), [])
        : [childrenKey, path];
};