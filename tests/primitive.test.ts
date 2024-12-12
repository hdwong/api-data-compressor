import { compress, decompress } from "../src";

test('number', () => {
  const data = 3.1415926;
  const compressed = compress(data);
  const decompressed = decompress(JSON.parse(JSON.stringify(compressed)));
  expect(decompressed).toEqual(data);
});

test('string', () => {
  const data = 'string';
  const compressed = compress(data);
  const decompressed = decompress(JSON.parse(JSON.stringify(compressed)));
  expect(decompressed).toEqual(data);
});

test('boolean', () => {
  const data = true;
  const compressed = compress(data);
  const decompressed = decompress(JSON.parse(JSON.stringify(compressed)));
  expect(decompressed).toEqual(data);
});
