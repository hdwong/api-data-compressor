import get from "lodash/get";
import set from "lodash/set";
import forEach from "lodash/forEach";
import { getType, isComplexThan } from "./helper";
import type { TCompressedData } from "./types";

/**
 * Compress value
 * @param value any - API response JSON data
 * @returns TCompressedData - compressed data
 */
export function compress(value: any): TCompressedData {
  const struct: any = undefined;

  const _compress = (value: any, path: Array<string | number> = []) => {
    const existsStruct = path.length ? get(struct, path) : struct;
    const type = getType(value);
    let currentStruct: any;
    let currentResult: any;
    if (!type) {
      // not supported type
      return [ false, value ];
    }
    if (type === 'o') {
      // object
      currentStruct = {};
      const _object: any = {};
      forEach(value, (v: any, k: string) => {
        const [ elStruct, elResult ] = _compress(v, [ ...path, k ]);
        if (!elStruct) {
          // not supported type
          return;
        }
        currentStruct[k] = elStruct;
        _object[k] = elResult;
      });
      // save struct
      if (!existsStruct) {
        set(struct, path, currentStruct);
      } else {
        const compare = isComplexThan(currentStruct, existsStruct);
        if (compare === 2) {
          // merge struct to exists struct
          const keys = Object.keys(existsStruct);
          Object.keys(currentStruct).filter(v => !keys.includes(v))
              .forEach(k => (existsStruct[k] = currentStruct[k]));
          currentStruct = existsStruct;
        }
      }
      // save result
      const _result: Array<any> = [];
      let end = Object.keys(_object).length;
      forEach(currentStruct, (_, k) => {
        if (end === 0) {
          return false;
        }
        if (typeof _object[k] !== 'undefined') {
          _result.push(_object[k]);
          end--;
        } else {
          _result.push(null);
        }
      });
      currentResult = _result;
    } else if (type === 'a') {
      // array
      const elPath = [ ...path, 0 ];
      let existsElStruct = existsStruct && Array.isArray(existsStruct) ? existsStruct[0] : undefined;
      const _result: Array<any> = [];
      forEach(value, (v: any, i: number) => {
        const [ elStruct, elResult ] = _compress(v, elPath);
        if (!elStruct) {
          // not supported type
          return;
        }
        _result[i] = elResult;
        if (!existsElStruct) {
          existsElStruct = elStruct;
        } else {
          const compare = isComplexThan(elStruct, existsElStruct);
          if (compare === 1) {
            // elStruct is more complex than existsElStruct
            existsElStruct = elStruct;
          }
        }
      });
      currentStruct = existsElStruct ? [ existsElStruct ] : [];
      currentResult = _result;
    } else {
      // base type, bool, number, string
      currentStruct = type;
      if (!existsStruct) {
        set(struct, path, currentStruct);
      } else if (isComplexThan(type, existsStruct) === -1) {
        currentStruct = existsStruct;
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
