const nacl = require('tweetnacl');

function dec(stringifiedObject) {
  if (typeof atob === 'undefined') {
    let buffer = Buffer.from(stringifiedObject, 'base64');
    return new Uint8Array(Array.prototype.slice.call(buffer, 0));
  } else {
    const decodedB64 = atob(stringifiedObject);
    const arr = new Uint8Array(decodedB64.length);
    for (let i = 0; i < decodedB64.length; i++) {
      arr[i] = decodedB64.charCodeAt(i);
    }
    return arr;
  }
}

function signObject(messageObject, secretKey) {
  const stringifiedObject = JSON.stringify(messageObject);
  const msg = dec(stringifiedObject);
  const signed = nacl.sign.detached(msg, secretKey);
  return JSON.stringify(Array.from(signed));
}

module.exports = { dec, signObject };
