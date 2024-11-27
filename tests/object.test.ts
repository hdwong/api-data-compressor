import { compress, decompress } from "../src";

test('object', () => {
  const data = { a: 1, b: 2, c: 3 };
  const compressed = compress(data);
  const decompressed = decompress(compressed);
  expect(JSON.stringify(decompressed)).toEqual(JSON.stringify(data));
});

test('object with nested objects', () => {
  const data = { a: 1, b: 2, c: { d: 3, e: [ 1, 2, 3 ] }, d: { foo: 'bar' } };
  const compressed = compress(data);
  const decompressed = decompress(compressed);
  expect(JSON.stringify(decompressed)).toEqual(JSON.stringify(data));
});
