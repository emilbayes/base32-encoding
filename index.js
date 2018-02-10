var std = '23456789abcdefghijkmnpqrstuvwxyz'

exports.stringify = function (buf, alphabet) {
  if (alphabet == null) alphabet = std
  return from(base32(buf), b => alphabet[b]).join('')
}

exports.parse = function (str, alphabet) {
  if (alphabet == null) alphabet = std
  return base256(str.split('').map(s => alphabet.indexOf(s)))
}

function from (buf, map) {
  var a = new Array(buf.length)

  for (var i = 0; i < a.length; i++) {
    a[i] = map(buf[i])
  }

  return a
}

exports.encode = base32
function base32 (buf, arr, offset) {
  exports.encode.bytes = Math.ceil(buf.length * 8 / 5)
  if (arr == null) arr = Buffer.alloc(exports.encode.bytes)
  if (offset == null) offset = 0

  // for every 5
  for (var i = 0, j = offset; i + 5 <= buf.length; i += 5, j += 8) {
    arr[j + 0] = ((buf[i + 0] & 0b11111000) >>> 3)
    arr[j + 1] = ((buf[i + 0] & 0b00000111)  << 2) | ((buf[i + 1] & 0b11000000) >>> 6)
    arr[j + 2] = ((buf[i + 1] & 0b00111110) >>> 1)
    arr[j + 3] = ((buf[i + 1] & 0b00000001)  << 4) | ((buf[i + 2] & 0b11110000) >>> 4)
    arr[j + 4] = ((buf[i + 2] & 0b00001111)  << 1) | ((buf[i + 3] & 0b10000000) >>> 7)
    arr[j + 5] = ((buf[i + 3] & 0b01111100) >>> 2)
    arr[j + 6] = ((buf[i + 3] & 0b00000011)  << 3) | ((buf[i + 4] & 0b11100000) >>> 5)
    arr[j + 7] = ((buf[i + 4] & 0b00011111))
  }

  // This switch statement is meant to be read from bottom to top
  switch (buf.length - i) {
    // No need for 5 since we work in batches of 5 above
    case 4:
      arr[j + 4] |= ((buf[i + 3] & 0b10000000) >>> 7)
      arr[j + 5] |= ((buf[i + 3] & 0b01111100) >>> 2)
      arr[j + 6] |= ((buf[i + 3] & 0b00000011)  << 3)

    case 3:
      arr[j + 3] |= ((buf[i + 2] & 0b11110000) >>> 4)
      arr[j + 4] |= ((buf[i + 2] & 0b00001111)  << 1)

    case 2:
      arr[j + 1] |= ((buf[i + 1] & 0b11000000) >>> 6)
      arr[j + 2] |= ((buf[i + 1] & 0b00111110) >>> 1)
      arr[j + 3] |= ((buf[i + 1] & 0b00000001)  << 4)

    case 1:
      arr[j + 0] |= ((buf[i + 0] & 0b11111000) >>> 3)
      arr[j + 1] |= ((buf[i + 0] & 0b00000111)  << 2)
  }

  return arr
}

exports.decode = base256
function base256 (buf, arr, offset) {
  exports.decode.bytes = Math.floor(buf.length * 5 / 8)
  if (arr == null) arr = Buffer.alloc(exports.decode.bytes)
  if (offset == null) offset = 0

  for (var i = 0, j = offset; i + 8 <= buf.length; i += 8, j += 5) {
    arr[j + 0] = (buf[i + 0] << 3) & 255 | (buf[i + 1] >>> 2) & 255
    arr[j + 1] = (buf[i + 1] << 6) & 255 | (buf[i + 2]  << 1) & 255 | (buf[i + 3] >>> 4) & 255
    arr[j + 2] = (buf[i + 3] << 4) & 255 | (buf[i + 4] >>> 1) & 255
    arr[j + 3] = (buf[i + 4] << 7) & 255 | (buf[i + 5]  << 2) & 255 | (buf[i + 6]  >> 3) & 255
    arr[j + 4] = (buf[i + 6] << 5) & 255 | (buf[i + 7]      ) & 255
  }

  switch (buf.length - i) {
    case 7:
      arr[j + 3] |= (buf[i + 6]  >> 3) & 255
      arr[j + 4] |= (buf[i + 6]  << 5) & 255

    case 6:
      arr[j + 3] |= (buf[i + 5]  << 2) & 255

    case 5:
      arr[j + 2] |= (buf[i + 4] >>> 1) & 255
      arr[j + 3] |= (buf[i + 4]  << 7) & 255

    case 4:
      arr[j + 1] |= (buf[i + 3] >>> 4) & 255
      arr[j + 2] |= (buf[i + 3]  << 4) & 255

    case 3:
      arr[j + 1] |= (buf[i + 2]  << 1) & 255

    case 2:
      arr[j + 0] |= (buf[i + 1] >>> 2) & 255
      arr[j + 1] |= (buf[i + 1]  << 6) & 255

    case 1:
      arr[j + 0] |= (buf[i + 0]  << 3) & 255
  }

  return arr
}

exports.encodingLength = function (buf) {
  return Math.ceil(buf.length * 8 / 5)
}
