import { getStructType, isComplexThan, isEmptyObject, isObjectOrArray, ZERO_KEY_INDEX } from "./helper";
import type { TCompressedData } from "./types";

/**
 * Decompress compressed data
 * @param data TCompressedData - compressed data
 * @returns any - the original JSON data
 */
export function decompress<T = any>(data: TCompressedData): T {
  if (typeof data !== 'object' || typeof data.struct === 'undefined' || typeof data.data === 'undefined') {
    throw new Error('Invalid compressed data');
  }

  const _decompress = (value: any, struct: any) => {
    // const currentStruct = path.length ? get(struct, path) : struct;
    if (isObjectOrArray(struct)) {
      const compare = isComplexThan(value, struct);
      if (compare <= 0) {
        // if current value is less complex than struct, return directly
        return value;
      }
      // if current value is object or array
      let structType = getStructType(struct);
      let isMixedObject = false;
      if (structType === 'ao' || structType === 'oa') {
        // mixed object, check first element of value
        isMixedObject = true;
        const first = value[0];
        const firstIsEmptyObject = isEmptyObject(first);
        structType = firstIsEmptyObject ? structType[1] : structType[0];
        if (firstIsEmptyObject) {
          // trim first element
          value.shift();
        }
      }
      if (structType === 'o') {
        // object
        const _result: Record<string, any> = {};
        let zeroKeyIndexOffset = 0;
        Object.keys(struct).forEach((k, i) => {
          if (isMixedObject && k === ZERO_KEY_INDEX) {
            zeroKeyIndexOffset = 1;
            return;
          }
          if (typeof value[i - zeroKeyIndexOffset] === 'undefined' || value[i - zeroKeyIndexOffset] === null) {
            return;
          }
          _result[k] = _decompress(value[i - zeroKeyIndexOffset], struct[k]);
        });
        return _result;
      } else if (structType === 'a') {
        // array
        const _result: Array<any> = [];
        value.forEach((v: any, i: number) => {
          _result[i] = _decompress(v, struct[isMixedObject ? ZERO_KEY_INDEX : 0]);
        });
        return _result;
      } else {
        // unexpected struct type
        return null;
      }
    } else if ('bns'.indexOf(struct) !== -1) {
      // base type, bool, number, string
      return value;
    }
  };

  return _decompress(data.data, data.struct);
}
