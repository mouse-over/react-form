import {isEmpty} from "@mouseover/js-validation";

export const parseIntOrNull = (value) => !isEmpty(value) ? parseInt(value) : null;
export const parseFloatOrNull = (value) => !isEmpty(value) ? parseFloat(value) : null;
export {shallowEqual} from  './shalowEqueal';
export {mergeDeep} from './mergeDeep';
export {updateValue} from './updateValue';
export {getValue} from './getValue';