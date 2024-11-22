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
{
  "struct": [
    {
      "id": "n",
      "name": "s",
      "address": { "street": "s", "city": "s", "state": "s", "zip": "s" },
      "phone": "s",
      "email": "s"
    }
  ],
  "data": [
    [
      1,
      "John Doe",
      ["123 Main St", "Springfield", "IL", "62701"],
      "555-555-5555",
      "john.doe@google.com"
    ],
    [
      2,
      "Jane Smith",
      ["456 Elm St", "Springfield", "IL", "62701"],
      "555-555-5555",
      "jane.smith@google.com"
    ],
    [
      3,
      "Bob Johnson",
      ["789 Oak St", "Springfield", "IL", "62701"],
      "555-555-5555",
      "bob.johnson@google.com"
    ],
    [
      4,
      "Alice Brown",
      ["1012 Pine St", "Springfield", "IL", "62701"],
      "555-555-5555",
      "alice.brown@google.com"
    ]
  ]
}
```

In this example, the original size of the JSON data is _668 bytes_, and the compressed size is _520 bytes_, which is a _22%_ reduction in size. The actual reduction is even more pronounced in larger datasets.

> **Note:** When the data is very small or consists of non-repeating structures, the compressed data may be larger than the original data because of the compressed data will preserve the structure of the original data. See the [examples](#other-examples) below.

### Decompressing Data

```javascript
import { decompress } from 'api-data-compressor';

const originalData = decompress(compressedData);
```

The `decompress` function will return the original JSON data from the compressed data returned by the `compress` function.

## Other Examples

<table>
<tr>
  <th>Case</th>
  <th>Original Data</th>
  <th>Compressed Data</th>
  <th>Compression Ratio</th>
</tr>
<tr>
  <td>String</td>
  <td>

```json
"Hello, World!"
```

  </td>
  <td>

```json
{ "struct": "s", "data": "Hello, World!" }
```

  </td>
  <td>
  Original: 15 bytes<br>
  Compressed: 37 bytes<br>
  Ratio: 246.67%
  </td>
</tr>
<tr>
  <td>An array</td>
  <td>

```json
[ 1, 2, 3, 4, 5]
```

  </td>
  <td>

```json
{ "struct": ["n"], "data": [1, 2, 3, 4, 5] }
```
  </td>
  <td>
  Original: 11 bytes<br>
  Compressed: 35 bytes<br>
  Ratio: 218.18%
  </td>
</tr>
<tr>
  <td>An object</td>
  <td>

```json
{ "id": 1, "name": "John Doe" }
```

  </td>
  <td>

```json
{
  "struct": { "id": "n", "name": "s" },
  "data": [1, "John Doe"]
}
```

  </td>
  <td>
  Original: 26 bytes<br>
  Compressed: 54 bytes<br>
  Ratio: 207.69%
  </td>
</tr>
<tr>
  <td>Complex object</td>
  <td>

```json
{
  "id": 1,
  "name": "John Doe",
  "address": {
    "street": "123 Main St",
    "city": "Springfield",
    "state": "IL",
    "zip": "62701"
  },
  "phone": "555-555-5555",
  "email": "john.doe@gmail.com"
}
```

  </td>
  <td>

```json
{
  "struct": {
    "id": "n",
    "name": "s",
    "address": {
      "street": "s", "city": "s",
      "state": "s", "zip": "s"
    },
    "phone": "s",
    "email": "s"
  },
  "data": [
    1,
    "John Doe",
    ["123 Main St", "Springfield", "IL", "62701"],
    "555-555-5555",
    "john.doe@gmail.com"
  ]
}
```

  </td>
  <td>
    Original: 161 bytes<br>
    Compressed: 215 bytes<br>
    Ratio: 133.54%
  </td>
</tr>
<tr>
  <td>Array of objects</td>
  <td>

```json
[
  { "id": 1, "name": "John Doe" },
  { "id": 2, "name": "Jane Smith" },
  { "id": 3, "name": "Bob Johnson" },
  { "id": 4, "name": "Alice Brown" },
  { "id": 5, "name": "Charlie Davis" },
  { "id": 6, "name": "Eve Wilson" },
  { "id": 7, "name": "Grace Lee" },
  { "id": 8, "name": "Henry Young" },
  { "id": 9, "name": "Ivy King" },
  { "id": 10, "name": "Jack Wright" },
  { "id": 11, "name": "Kelly Lopez" },
  { "id": 12, "name": "Morgan Hill" },
  { "id": 13, "name": "Nora Green" },
  { "id": 14, "name": "Oscar Adams" },
  { "id": 15, "name": "Penny Baker" },
  { "id": 16, "name": "Quinn Carter" },
  { "id": 17, "name": "Riley Clark" },
  { "id": 18, "name": "Sammy Davis" },
  { "id": 19, "name": "Terry Evans" },
  { "id": 20, "name": "Ursula Fisher" },
  { "id": 21, "name": "Vivian Gray" },
  { "id": 22, "name": "Walter Harris" },
  { "id": 23, "name": "Xavier Irwin" },
  { "id": 24, "name": "Yvonne Johnson" },
  { "id": 25, "name": "Zachary King" },
  { "id": 26, "name": "Amanda Lee" },
  { "id": 27, "name": "Brian Miller" },
  { "id": 28, "name": "Cindy Nelson" },
  { "id": 29, "name": "David Olson" },
  { "id": 30, "name": "Ella Peterson" },
]
```

  </td>
  <td>

```json
{
  "struct": [{ "id": "n", "name": "s" }],
  "data": [
    [1, "John Doe"],
    [2, "Jane Smith"],
    [3, "Bob Johnson"],
    [4, "Alice Brown"],
    [5, "Charlie Davis"],
    [6, "Eve Wilson"],
    [7, "Grace Lee"],
    [8, "Henry Young"],
    [9, "Ivy King"],
    [10, "Jack Wright"],
    [11, "Kelly Lopez"],
    [12, "Morgan Hill"],
    [13, "Nora Green"],
    [14, "Oscar Adams"],
    [15, "Penny Baker"],
    [16, "Quinn Carter"],
    [17, "Riley Clark"],
    [18, "Sammy Davis"],
    [19, "Terry Evans"],
    [20, "Ursula Fisher"],
    [21, "Vivian Gray"],
    [22, "Walter Harris"],
    [23, "Xavier Irwin"],
    [24, "Yvonne Johnson"],
    [25, "Zachary King"],
    [26, "Amanda Lee"],
    [27, "Brian Miller"],
    [28, "Cindy Nelson"],
    [29, "David Olson"],
    [30, "Ella Peterson"]
  ]
}

```

  </td>
  <td>
    Original: 926 bytes<br>
    Compressed: 608 bytes<br>
    Ratio: 65.66%
  </td>
</tr>
<tr>
  <td>Array of objects with <br>different structures</td>
  <td>

```json
[
  { a: 1, b: 2 },
  { b: 3, c: 4 },
  { c: 5, d: 6 },
  { d: 6, b: 3 },
  { c: 4, a: 1 },
]
```

  </td>
  <td>

```json
{
  "struct": [{
    "a": "n", "b": "n",
    "c": "n", "d": "n"
  }],
  "data": [
    [1, 2],
    [null, 3, 4],
    [null, null, 5, 6],
    [null, 3, null, 6],
    [1, null, 4]
  ]
}
```

  </td>
  <td>
    Original: 71 bytes<br>
    Compressed: 115 bytes<br>
    Ratio: 161.97%
  </td>
</tr>
</table>

## License
MIT
