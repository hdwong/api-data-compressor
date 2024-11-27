import { compress, decompress } from "./src";

const data = [1, 2, 3];

const result = compress(data);
console.dir(result, { depth: null });
const origin = decompress(result);
console.dir(origin, { depth: null });
