var std = '23456789abcdefghijkmnpqrstuvwxyz'

exports.encode = function (buf, alphabet) {
  if (alphabet == null) alphabet = std
  return from(base32(buf), b => alphabet[b]).join('')
}

exports.decode = function (str, alphabet) {
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


function base32 (buf) {
  var arr = Buffer.alloc(Math.ceil(buf.length * 8 / 5))

  // for every 5
  for (var i = 0; i < Math.floor(buf.length / 5); i += 5) {
    arr[i + 0] = ((buf[i + 0] & 0b11111000) >>> 3)
    arr[i + 1] = ((buf[i + 0] & 0b00000111)  << 2) | ((buf[i + 1] & 0b11000000) >>> 6)
    arr[i + 2] = ((buf[i + 1] & 0b00111110) >>> 1)
    arr[i + 3] = ((buf[i + 1] & 0b00000001)  << 4) | ((buf[i + 2] & 0b11110000) >>> 4)
    arr[i + 4] = ((buf[i + 2] & 0b00001111)  << 1) | ((buf[i + 3] & 0b10000000) >>> 7)
    arr[i + 5] = ((buf[i + 3] & 0b01111100) >>> 2)
    arr[i + 6] = ((buf[i + 3] & 0b00000011)  << 3) | ((buf[i + 4] & 0b11100000) >>> 5)
    arr[i + 7] = ((buf[i + 4] & 0b00011111))
  }

  // This switch statement is meant to be read from bottom to top
  switch (buf.length - i) {
    // No need for 5 since we work in batches of 5 above
    case 4:
      arr[i + 4] |= ((buf[i + 3] & 0b10000000) >>> 7)
      arr[i + 5] |= ((buf[i + 3] & 0b01111100) >>> 2)
      arr[i + 6] |= ((buf[i + 3] & 0b00000011)  << 3)

    case 3:
      arr[i + 3] |= ((buf[i + 2] & 0b11110000) >>> 4)
      arr[i + 4] |= ((buf[i + 2] & 0b00001111)  << 1)

    case 2:
      arr[i + 1] |= ((buf[i + 1] & 0b11000000) >>> 6)
      arr[i + 2] |= ((buf[i + 1] & 0b00111110) >>> 1)
      arr[i + 3] |= ((buf[i + 1] & 0b00000001)  << 4)

    case 1:
      arr[i + 0] |= ((buf[i + 0] & 0b11111000) >>> 3)
      arr[i + 1] |= ((buf[i + 0] & 0b00000111)  << 2)
  }

  return arr
}

function bitstring (arr) {
  var pad = '00000000'
  return from(arr, function (n) {
    var s = n.toString(2)
    return pad.slice(0, 8 - s.length) + s
  }).join('|')
}

function base256 (buf) {
  var arr = Buffer.alloc(Math.ceil(buf.length * 5 / 8))

  for (var i = 0; i < Math.floor(buf.length / 8); i += 8) {
    arr[i + 0] = (buf[i + 0] << 3) & 255 | (buf[i + 1] >>> 2) & 255
    arr[i + 1] = (buf[i + 1] << 6) & 255 | (buf[i + 2]  << 1) & 255 | (buf[i + 3] >>> 4) & 255
    arr[i + 2] = (buf[i + 3] << 4) & 255 | (buf[i + 4] >>> 1) & 255
    arr[i + 3] = (buf[i + 4] << 7) & 255 | (buf[i + 5]  << 2) & 255 | (buf[i + 6]  >> 3) & 255
    arr[i + 4] = (buf[i + 6] << 5) & 255 | (buf[i + 7]      ) & 255
  }

  switch (buf.length - i) {
    case 7:
      arr[i + 3] |= (buf[i + 6]  >> 3) & 255
      arr[i + 4] |= (buf[i + 6]  << 5) & 255

    case 6:
      arr[i + 3] |= (buf[i + 5]  << 2) & 255

    case 5:
      arr[i + 2] |= (buf[i + 4] >>> 1) & 255
      arr[i + 3] |= (buf[i + 4]  << 7) & 255

    case 4:
      arr[i + 1] |= (buf[i + 3] >>> 4) & 255
      arr[i + 2] |= (buf[i + 3]  << 4) & 255

    case 3:
      arr[i + 1] |= (buf[i + 2]  << 1) & 255

    case 2:
      arr[i + 0] |= (buf[i + 1] >>> 2) & 255
      arr[i + 1] |= (buf[i + 1]  << 6) & 255

    case 1:
      arr[i + 0] |= (buf[i + 0]  << 3) & 255
  }

  return arr
}
