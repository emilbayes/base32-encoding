var randomBytes = require('crypto').randomBytes
var base32 = require('.')
var assert = require('assert')

for (var i = 0; i < 1e5; i++) {
  var buf = randomBytes(Math.random() * 128 | 0)

  var enc = base32.encode(buf)
  var dec = base32.decode(enc)
  assert(buf.equals(dec))
}

function bitstring (arr, i) {
  var pad = '00000000'
  return from(arr, function (n) {
    var s = n.toString(2)
    return pad.slice(0, i - s.length) + s
  }).join('')
}
