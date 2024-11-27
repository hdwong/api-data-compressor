import { compress, decompress } from "../src";

test('array', () => {
  const data = [1, 2, 3, 4, 5];
  const compressed = compress(data);
  const decompressed = decompress(compressed);
  expect(JSON.stringify(decompressed)).toEqual(JSON.stringify(data));
});

test('array with object', () => {
  const data = [{ a: 1, b: 2 }, { b: 2, c: 3 }, { c: 3, d: 4 }];
  const compressed = compress(data);
  const decompressed = decompress(compressed);
  expect(JSON.stringify(decompressed)).toEqual(JSON.stringify(data));
});

test('array with mixed types (object first)', () => {
  const data = [1, 'string', true, { a: 1, b: 2 }, [3, 4], { c: 5, d: 6 }];
  const compressed = compress(data);
  const decompressed = decompress(compressed);
  expect(JSON.stringify(decompressed)).toEqual(JSON.stringify(data));
});

test('array with mixed types (array first)', () => {
  const data = [[3, 4], 1, 'string', true, { a: 1, b: 2 }, { c: 5, d: 6 }];
  const compressed = compress(data);
  const decompressed = decompress(compressed);
  expect(JSON.stringify(decompressed)).toEqual(JSON.stringify(data));
});

test('array with nested elements', () => {
  const data = [1, [2, [{foo:'bar'}, 4], 5], 6, [{foo:[{a: 1, b: 2}, [1, 2, 3]]}]];
  const compressed = compress(data);
  const decompressed = decompress(compressed);
  expect(JSON.stringify(decompressed)).toEqual(JSON.stringify(data));
});
