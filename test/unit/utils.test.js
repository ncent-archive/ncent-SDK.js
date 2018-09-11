const utils = require('../../source/utils');
const StellarSdk = require('stellar-sdk');
const nacl = require('tweetnacl');

describe('signObject', () => {
  const keypair1 = StellarSdk.Keypair.random();
  const keypair2 = StellarSdk.Keypair.random();
  const messageObj = {
    fromAddress: keypair1.publicKey(),
    toAddress: keypair2.publicKey(),
    amount: 100
  };

  let signed;

  it('signs an object with a secret key', () => {
    signed = utils.signObject(messageObj, keypair1._secretKey);
    expect(typeof signed).toBe('string');
  });
  it ('creates a signed object that can be verified', () => {
    const uint8signed = Uint8Array.from(JSON.parse(signed));
    const msg = utils.dec(JSON.stringify(messageObj));
    const verified = nacl.sign.detached.verify(
      msg,
      uint8signed,
      keypair1._publicKey
    );
    expect(verified).toBe(true);
  });
});
