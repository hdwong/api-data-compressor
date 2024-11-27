export const ZERO_KEY_INDEX = ''; // may be changed to other value, like '00'

/**
 * get variable type
 * @param value - the variable to check
 * @returns 'b' if value is boolean,
 *    'n' if value is number or bigint,
 *    's' if value is string,
 *    'a' if value is array,
 *    'o' if value is object,
 *    false if value is not supported type or null / undefined
 */
export function getType(value: any) {
  const t = typeof value;
  if (value === null || [ 'undefined', 'symbol', 'function' ].includes(t)) {
    // null / undefined / symbol / function are not supported yet
    return false;
  }
  if (t === 'boolean') {
    return 'b';
  } else if (t === 'number' || t === 'bigint') {
    return 'n';
  } else if (t === 'string') {
    return 's';
  }
  return Array.isArray(value) ? 'a' : 'o';
};

/**
 * check if value is object or array
 * @param value - the variable to check
 * @returns true if value is object or array, false otherwise
 */
export function isObjectOrArray(value: any) {
  return typeof value === 'object' && value !== null;
}

/**
 * check if value is an empty object
 * @param value - the variable to check
 * @returns true if value is an empty object, false otherwise
 */
export function isEmptyObject(value: any) {
  return isObjectOrArray(value) && !Array.isArray(value) && Object.keys(value).length === 0;
}

/**
 * get object type
 * @param struct - the object to check
 * @returns 'o' if struct is pure object,
 *    'a' if struct is array,
 *    'oa' if struct is object after array,
 *    'ao' if struct is array after object
 */
export function getStructType(struct: any) {
  if (!isObjectOrArray(struct)) {
    return false;
  }
  if (Array.isArray(struct)) {
    return 'a';
  }
  const zeroKeyIndex = Object.keys(struct).indexOf(ZERO_KEY_INDEX);
  if (zeroKeyIndex === -1) {
    return 'o';
  }
  return zeroKeyIndex === 0 ? 'ao' : 'oa';
}

/**
 * check if a is more complex than b
 * @param a - the first value
 * @param b - the second value
 * @returns 2 if a and b are both object or array,
 *    1 if a is object or array and b is not,
 *    0 if a and b are both basic types,
 *    -1 if a is not object or array and b is object or array
 */
export function isComplexThan(a: any, b: any) {
  if (!isObjectOrArray(a)) {
    return isObjectOrArray(b) ? -1 : 0;
  }
  return isObjectOrArray(b) ? 2 : 1;
}

/**
 * merge two structs
 * @param a - the first struct
 * @param b - the second struct
 * @returns the merged struct
 */
export function mergeStruct(a: Record<string, any>, b: Record<string, any>) {
  if (Array.isArray(a)) {
    // if a and b are both arrays, return a
    // if a is array and b is object, return b
    return Array.isArray(b) ? a : b;
  }
  const _a: Record<string, any> = Object.assign({}, a);
  const keys = Object.keys(_a);
  Object.keys(b).filter(k => !keys.includes(k)).forEach(k => _a[k] = b[k]);
  return _a;
}
