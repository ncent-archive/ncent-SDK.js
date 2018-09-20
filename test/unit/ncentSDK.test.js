const nCentSDK = require('../../source/ncentSDK.js');
const sdk = new nCentSDK("http://localhost:8010/api");

describe('createWalletAddress', () => {
  let wallet;

  beforeEach(async (done) => {
    wallet = sdk.createWalletAddress();
  });

  it('returns a stellar keypair', () => {
    const publicKey = wallet.publicKey();
    const secret = wallet.secret();

    expect(typeof wallet).toBe('object');
    expect(typeof publicKey).toBe('string');
    expect(publicKey.length).toBe(56);
    expect(typeof secret).toBe('string');
    expect(secret.length).toBe(56);
  });
});

describe('getWallets', () => {

});
describe('getWallet', () => {

});
describe('getWalletBalance', () => {

});
describe('stampToken', () => {

});
describe('getTokenTypes', () => {

});
describe('getTokenTypeData', () => {

});
describe('getTransactions', () => {

});
describe('createChallenge', () => {

});
describe('shareChallenge', () => {

});
describe('redeemChallenge', () => {

});
describe('retrieveProvenanceChain', () => {

});
describe('retrieveProvenanceChainFIFO', () => {

});