const mySDK = require('../source/ncentSDK.js');

const sdk = new mySDK('http://18.219.87.29:8010/api');

function defaultResolve(response) {
    console.log(response.data);
}
function defaultReject(error) {
    console.log(error);
}

const keypair1 = sdk.createWalletAddress();
const keypair2 = sdk.createWalletAddress();
console.log(keypair1, keypair2);

let tokenId;

new Promise((resolve, reject) => {
    return sdk.stampToken(
      keypair1.publicKey(),
      'testCent',
      1000000,
      '2021',
      resolve,
      reject
    );
})
.then((response) => {
    tokenId = response.data["token"]["uuid"];
})
.then(() => {
    return sdk.transferTokens(
      keypair1, keypair2.publicKey(), tokenId, 10, defaultResolve, defaultReject
    );
})
.then(() => {
  return sdk.destroyTokens(
    keypair1, tokenId, defaultResolve, defaultReject
  );
})
.catch((error) => {
    console.log(error);
});
