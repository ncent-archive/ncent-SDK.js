// const nCentSDK = require('ncent-sandbox-sdk');
const nCentSDK = require('../source/ncentSDK');

const sdk = new nCentSDK("http://localhost:8010/api");

const TOKEN_NAME = 'kkkkkCent'; // MUST BE UNIQUE
const TOKEN_COUNT = 10000;
const EXPIRATION_YEAR = '2021';
const TRANSFER_AMOUNT = 100;

const demo = async () => {
  try {
    const keypair1 = sdk.createWalletAddress();
    const secondGiver = sdk.createWalletAddress();
    const keypair2 = sdk.createWalletAddress();
    const keypair3 = sdk.createWalletAddress();
    const stampRet = await sdk.stampToken(
      keypair1.publicKey(),
      TOKEN_NAME,
      TOKEN_COUNT,
      EXPIRATION_YEAR,
    );
    const tokenId = stampRet.data['token']['uuid'];
    const transferRet = await sdk.transferTokens(
      keypair1,
      keypair2.publicKey(),
      tokenId,
      TRANSFER_AMOUNT,
    );
    const txn = transferRet.data['txn'];
    console.log(`Transferred ${txn.amount} of ${tokenId} from ${txn.fromAddress} to ${txn.toAddress}`);
    const transferRet2 = await sdk.transferTokens(
      keypair1,
      secondGiver.publicKey(),
      tokenId,
      TRANSFER_AMOUNT,
      );
      const txn2 = transferRet2.data['txn'];
      console.log(`Transferred ${txn2.amount} of ${tokenId} from ${txn2.fromAddress} to ${txn2.toAddress}`);
    const transferRet3 = await sdk.transferTokens(
      keypair2,
      keypair3.publicKey(),
      tokenId,
      TRANSFER_AMOUNT,
    );
    const txn3 = transferRet3.data["txn"];
    console.log(`Transferred ${txn3.amount} of ${tokenId} from ${txn3.fromAddress} to ${txn3.toAddress}`);
    const transferRet4 = await sdk.transferTokens(
      secondGiver,
      keypair3.publicKey(),
      tokenId,
      TRANSFER_AMOUNT,
    );
    const txn4 = transferRet4.data["txn"];
    console.log(`Transferred ${txn4.amount} of ${tokenId} from ${txn4.fromAddress} to ${txn4.toAddress}`);
    const currentKeyPair3Wallet = await sdk.getTokenBalance(keypair3.publicKey(), tokenId);
    console.log(`Wallet with public key ${keypair3.publicKey()} has ${currentKeyPair3Wallet.data[0].balance} tokens`);
    const chain = await sdk.getProvenanceChain(tokenId, keypair3.publicKey());
    console.log(`Here is the provenance chain of that wallet:`, chain.data);
  } catch (error) {
    error.response.data.errors.forEach((error)=>{
      console.log(error.message);
    })
  }
};

demo();
