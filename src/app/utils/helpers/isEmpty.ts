/* eslint-disable no-underscore-dangle */
export const _isEmpty = (val: unknown | any) => val == null || !(Object.keys(val) || val).length;
