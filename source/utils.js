const nacl = require('tweetnacl');

function dec(stringifiedObject) {
  if (typeof atob === 'undefined') {
    let buffer = Buffer.from(stringifiedObject, 'base64');
    return new Uint8Array(Array.prototype.slice.call(buffer, 0));
  } else {
    const d = atob(stringifiedObject);
    const b = new Uint8Array(d.length);
    for (var i = 0; i < d.length; i++) b[i] = d.charCodeAt(i);
    return b;
  }
}

function signObject(messageObject, secretKey) {
  const stringifiedObject = JSON.stringify(messageObject);
  const msg = dec(stringifiedObject);
  const signed = nacl.sign.detached(msg, secretKey);
  return JSON.stringify(Array.from(signed));
}

module.exports = { signObject };
