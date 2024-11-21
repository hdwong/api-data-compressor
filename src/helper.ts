/* get variable type */
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

/* check if value is object or array */
export function isObjectOrArray(value: any) {
  return typeof value === 'object' && value !== null;
}

/* compare two values */
export function isComplexThan(a: any, b: any) {
  if (!isObjectOrArray(a)) {
    // if a is not object or array and b is object or array, a is less complex than b, return -1
    // if a and b are both basic types, return 0
    return isObjectOrArray(b) ? -1 : 0;
  }
  // if a is object or array and b is not object or array, a is more complex than b, return 1
  // if a and b are both object or array, return 2
  return isObjectOrArray(b) ? 2 : 1;
}
