import { compress } from './compress';
import { decompress } from './decompress';

const version = process.env.VERSION;

export {
  compress,
  decompress,
  version,
}
