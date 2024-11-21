# api-data-compressor

This is a simple data compressor for JSON data in API responses. It will analyze the JSON structure and transform the JS objects into arrays to reduce the size of the response.

> **Note:** This compressor is designed for JSON structured optimizations, not a real compression algorithm like gzip.

## Installation

```bash
npm install api-data-compressor
```

## Usage

### Compressing Data

```javascript
import { compress } from 'api-data-compressor';

const data = [{
  id: 1,
  name: 'John Doe',
  address: {
    street: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    zip: '62701'
  },
  phone: '555-555-5555',
  email: 'john.doe@google.com'
}, {
  id: 2,
  name: 'Jane Smith',
  address: {
    street: '456 Elm St',
    city: 'Springfield',
    state: 'IL',
    zip: '62701'
  },
  phone: '555-555-5555',
  email: 'jane.smith@google.com'
}, {
  id: 3,
  name: 'Bob Johnson',
  address: {
    street: '789 Oak St',
    city: 'Springfield',
    state: 'IL',
    zip: '62701'
  },
  phone: '555-555-5555',
  email: 'bob.johnson@google.com'
}, {
  id: 4,
  name: 'Alice Brown',
  address: {
    street: '1012 Pine St',
    city: 'Springfield',
    state: 'IL',
    zip: '62701'
  },
  phone: '555-555-5555',
  email: 'alice.brown@google.com'
}];

const compressedData = compress(data);
```

The `compress` function will return an object with two properties: `struct` and `data`. The `struct` property contains the structure of the original JSON data, and the `data` property contains the transformed data.

```json
{"struct":[{"id":"n","name":"s","address":{"street":"s","city":"s","state":"s","zip":"s"},"phone":"s","email":"s"}],"data":[[1,"John Doe",["123 Main St","Springfield","IL","62701"],"555-555-5555","john.doe@google.com"],[2,"Jane Smith",["456 Elm St","Springfield","IL","62701"],"555-555-5555","jane.smith@google.com"],[3,"Bob Johnson",["789 Oak St","Springfield","IL","62701"],"555-555-5555","bob.johnson@google.com"],[4,"Alice Brown",["1012 Pine St","Springfield","IL","62701"],"555-555-5555","alice.brown@google.com"]]}
```

In this example, the original size of the JSON data is _668 bytes_, and the compressed size is _520 bytes_, which is a _22%_ reduction in size. The actual reduction is even more pronounced in larger datasets.

> **Note:** When the data is very small or consists of non-repeating structures, the compressed data may be larger than the original data because of the compressed data will preserve the structure of the original data.

### Decompressing Data

```javascript
import { decompress } from 'api-data-compressor';

const originalData = decompress(compressedData);
```

The `decompress` function will return the original JSON data from the compressed data returned by the `compress` function.

## License
MIT
