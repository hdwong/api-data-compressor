import { getStructType, getType, isComplexThan, mergeStruct, ZERO_KEY_INDEX } from "./helper";
import type { TCompressedData, TCompressOptions } from "./types";

/**
 * Compress value
 * @param value any - API response JSON data
 * @returns TCompressedData - compressed data
 */
export function compress(value: any, options?: TCompressOptions ): TCompressedData {
  let emptyCollectionToNull = false;
  if (options && typeof options.emptyCollectionToNull === 'boolean') {
    emptyCollectionToNull = options.emptyCollectionToNull;
  }
  const _compress = (value: any, struct: any = undefined) => {
    const type = getType(value, emptyCollectionToNull);
    if (!type) {
      // not supported type
      return [ false, value ];
    }
    if (typeof struct === 'undefined' || !struct) {
      // initialize default struct
      if (type === 'o') {
        struct = {};
      } else if (type === 'a') {
        struct = [];
      } else {
        struct = type;
      }
    }
    let structType = getStructType(struct);
    let currentStruct: any;
    let currentResult: any;
    if (type === 'o') {
      // object
      let oldStruct = undefined;
      if (!structType) {
        // if struct is undefined / null or primitive type, set struct as an empty object
        struct = {};
      } else if (structType === 'a') {
        // if exists struct is array, convert to object, convert structType to 'ao'
        oldStruct = struct.slice(); // backup old struct
        if (oldStruct.length === 0) {
          oldStruct[0] = false;
        }
        struct = {};
        structType = 'ao';
      } else if (structType === 'ao') {
        oldStruct = struct.slice(); // backup old struct
        struct = struct[1];
      }
      const _object: any = {};
      for (const k in value) {
        // compress each element of object
        const [ elStruct, elResult ] = _compress(value[k], struct[k]);
        if (!elStruct) {
          // not supported type
          continue;
        }
        const compare = isComplexThan(elStruct, struct[k]);
        if (compare === 2) {
          struct[k] = mergeStruct(struct[k], elStruct);
        } else if (compare === 1 || typeof struct[k] === 'undefined' || !struct[k]) {
          struct[k] = elStruct;
        }
        _object[k] = elResult;
      }
      // merge struct and generate result
      const _result: Array<any> = [];
      if (structType === 'ao') {
        // add a sign to the first element of result
        _result.push({});
      }
      // merge struct and generate result
      let end = Object.keys(_object).length;
      for (const k in struct) {
        if (k === ZERO_KEY_INDEX) {
          continue;
        }
        if (end === 0) {
          break;
        }
        if (typeof _object[k] !== 'undefined') {
          _result.push(_object[k]);
          end--;
        } else {
          _result.push(null);
        }
      }
      if (oldStruct) {
        currentStruct = [ oldStruct[0], struct ];
      } else {
        currentStruct = struct;
      }
      currentResult = _result;
    } else if (type === 'a') {
      // array
      let k: string | number = 0;
      let isMixedObject = false;
      if (!structType) {
        // if struct is undefined / null or primitive type, set struct as an empty array
        struct = [];
      } else if (structType === 'o') {
        // if exists struct is object, add ZERO_KEY_INDEX to struct, convert structType to 'oa'
        isMixedObject = true;
        struct = { ...struct, [ZERO_KEY_INDEX]: false };
        structType = 'oa';
        k = ZERO_KEY_INDEX;
      } else if (structType === 'oa') {
        isMixedObject = true;
        k = ZERO_KEY_INDEX;
      } else if (structType === 'ao') {
        // if exists struct is array of object, convert structType to 'oa'
        structType = 'a';
        k = 0;
      }

      const _array: Array<any> = [];
      if (isMixedObject) {
        // add a sign to the first element of result
        _array.push({});
      }
      (value as Array<any>).forEach((v: any, i: number) => {
        const [ elStruct, elResult ] = _compress(v, struct[k]);
        if (!elStruct) {
          // not supported type
          return;
        }
        // merge struct
        const compare = isComplexThan(elStruct, struct[k]);
        if (compare === 2) {
          struct[k] = mergeStruct(struct[k], elStruct);
        } else if (compare === 1 || typeof struct[k] === 'undefined' || !struct[k]) {
          struct[k] = elStruct;
        }
        _array[isMixedObject ? (i + 1) : i] = elResult;
      });
      currentStruct = struct;
      currentResult = _array;
    } else {
      // primitive type, bool, number, string
      currentStruct = type;
      if (isComplexThan(type, struct) === -1) {
        // if current type is less complex than struct, update struct
        currentStruct = struct;
      }
      currentResult = value;
    }
    return [ currentStruct, currentResult ];
  };
  const result = _compress(value);

  return {
    struct: result[0],
    data: result[1],
  };
};
