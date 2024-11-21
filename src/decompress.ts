import { get } from "lodash";
import { isComplexThan, isObjectOrArray } from "./helper";
import type { TCompressedData } from "./types";

/**
 * Decompress compressed data
 * @param data TCompressedData - compressed data
 * @returns any - the original JSON data
 */
export function decompress<T = any>(data: TCompressedData): T {
  const struct = data.struct;
  const result = data.data;

  const _decompress = (value: any, path: Array<string | number> = []) => {
    const currentStruct = path.length ? get(struct, path) : struct;
    const currentResult = value;
    if (isObjectOrArray(currentStruct)) {
      const compare = isComplexThan(currentResult, currentStruct);
      if (compare <= 0) {
        // if current value is less complex than struct, return directly
        return currentResult;
      }
      // if current value is object or array
      let _result: Array<any> | Record<string, any>;
      if (Array.isArray(currentStruct)) {
        // array, iterate and generate result array
        const elPath = [ ...path, 0 ];
        _result = currentResult.map((v: any) => _decompress(v, elPath));
      } else {
        // object, iterate and generate result object
        _result = {};
        Object.keys(currentStruct).forEach((k, i) => {
          if (typeof currentResult[i] === 'undefined' || currentResult[i] === null) {
            return;
          }
          (_result as Record<string, any>)[k] = _decompress(currentResult[i], [ ...path, k ]);
        });
      }
      return _result;
    } else if ('bns'.indexOf(currentStruct) !== -1) {
      // base type, bool, number, string
      return currentResult;
    }
  };
  return _decompress(result);
}
