const mySDK = require('../source/ncentSDK.js');
//
const sdk = new mySDK('http://18.219.87.29:8010/api');
//
const keypair1 = sdk.createWalletAddress();
const keypair2 = sdk.createWalletAddress();

async function createWallet() {
  const tokenId = await sdk.stampToken(
    keypair1.publicKey(),
    'bbbbbb',
    1000000,
    '2021',
    (response)=>console.log(response.data)
  );
  return tokenId;
};
createWallet();
//
// async function runTest() {
//   const tokenId = createWallet();
//   console.log(tokenId);
//   await sdk.transferTokens(
//     keypair1,
//     keypair2.publicKey(),
//     tokenId,
//     10,
//     (response) => console.log("Successfully transferred tokens"),
//     (reject) => console.log("Error transferring tokens")
//   );
//   await sdk.destroyTokens(
//     keypair1,
//     tokenId,
//     (resp) => console.log("Destroyed tokens successfully"),
//     (reject) => console.log("Error destroying tokens")
//   );
//   console.log("at the end")
// }
//
// runTest();
//
// // createWallet(
// //   response => {
// //     // const tokenId = response.data["token"]["uuid"];
// //     // console.log(`Stamped token ${tokenId}`);
// //     sdk.transferTokens(
// //       keypair1,
// //       keypair2.publicKey(),
// //       tokenId,
// //       10,
// //       () => {
// //         console.log(`Transfer:${keypair1.publicKey()} ${keypair2.publicKey()}`);
// //         sdk.destroyTokens(
// //           keypair1,
// //           tokenId,
// //           (resp) => console.log("Destroyed tokens successfully"),
// //           (reject) => console.log("Error destroying tokens")
// //         );
// //       },
// //       (reject) => console.log("Error transferring tokens")
// //     );
// //   },
// //   reject => console.log()
// // );
