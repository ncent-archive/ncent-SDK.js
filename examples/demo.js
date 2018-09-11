const nCentSDK = require('ncent-sandbox-sdk');

const sdk = new nCentSDK();

const TOKEN_NAME = 'Tokename'; // MUST BE UNIQUE
const TOKEN_COUNT = 10000;
const EXPIRATION_YEAR = '2021';
const TRANSFER_AMOUNT = 100;

const demo = async () => {
  try {
    const keypair1 = sdk.createWalletAddress();
    const keypair2 = sdk.createWalletAddress();
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
    console.log(`${tokenId}\n`, txn);
  } catch (error) {
    error.response.data.errors.forEach((error)=>{
      console.log(error.message);
    })
  }
};

demo();
