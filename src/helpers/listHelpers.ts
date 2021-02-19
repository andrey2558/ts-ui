export const generateId = (array: Array<unknown>): number => {
    return parseInt(`${array.length}${Date.now()}`);
};