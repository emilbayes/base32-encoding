var randomBytes = require('crypto').randomBytes
var base32 = require('.')
var assert = require('assert')

for (var i = 0; i < 1e5; i++) {
  var a = randomBytes(Math.random() * 32 | 0)

  var str = base32.encode(a)
  console.log(str)
  assert(a.equals(base32.decode(str)))
}
