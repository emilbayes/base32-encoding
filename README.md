# `base32-encoding `

> Encode / decode base32. Supports Buffers, strings, custom alphabets, abstract-encoding compliant

## Usage

```js
var base32 = require('base32-encoding')

var buf = crypto.randomBytes(32)

var b32 = base32.encode(buf)
var b256 = base32.decode(b32)

var str = base32.stringify(buf) // base32.encode then convert to string
var origBuf = base32.parse(str) // convert from string then base32.decode
```

## API

### `var output = base32.encode(buf, [output], [offset])`

Encode a normal `Buffer` as base32, meaning only the lower 5 bits are used.
Takes `⌈len * 8 / 5⌉` bytes to encode. Takes optional `Buffer` `output` instead
of allocating a new `Buffer` internally, and writes at optional `offset`.
Returns `output`. Sets `base32.encode.bytes` to the number of bytes written.

### `var output = base32.decode(buf, [output], [offset])`

Decode a base32 `Buffer` as a normal, "base256" `Buffer`, meaning only the lower
5 bits are read from `buf` and assembled into complete 8 bit bytes.
Takes `⌊len * 5 / 8⌋` bytes to encode. Takes optional `Buffer` `output` instead
of allocating a new `Buffer` internally, and writes at optional `offset`.
Returns `output`. Sets `base32.decode.bytes` to the number of bytes written.

### `var len = base32.encodingLength(buf)`

Returns `⌈len * 8 / 5⌉`.

### `var str = base32.stringify(buf, [alphabet])`

Encode `buf` to base32 and translate into a string using optional `alphabet`.
`alphabet` defaults to `23456789abcdefghijkmnpqrstuvwxyz` (missing `o01l`).

### `var buf = base32.parse(str, [alphabet])`

Decode `str` from base32 and translate from a string using optional `alphabet`.
`alphabet` defaults to `23456789abcdefghijkmnpqrstuvwxyz` (missing `o01l`).

## Install

```sh
npm install base32-encoding
```

## License

[ISC](LICENSE)
