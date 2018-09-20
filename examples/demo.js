// const nCentSDK = require('ncent-sandbox-sdk');
const nCentSDK = require("../source/ncentSDK");

const sdk = new nCentSDK("http://localhost:8010/api");

const TOKEN_NAME = "tttt"; // MUST BE UNIQUE
const TOKEN_COUNT = 10000;
const EXPIRATION_YEAR = "2021";

const transferTokens = async (sponsorKeypair, tokenTypeUuid, receiverKeypair, amount) => {
  const createdChallengeRet = await sdk.createChallenge(
    sponsorKeypair,
    tokenTypeUuid,
    amount
  );
  const createdChallenge = createdChallengeRet.data;
  console.log(
    `${sponsorKeypair.publicKey()} created challenge ${createdChallenge.uuid} with ${amount} of ${tokenTypeUuid}\n`
  );
  const sharedChallengeRet = await sdk.shareChallenge(
    sponsorKeypair,
    createdChallenge.uuid,
    receiverKeypair.publicKey()
  );
  const sharedChallenge = sharedChallengeRet.data.transaction;
  console.log(`${sponsorKeypair.publicKey()} shared the challenge with ${receiverKeypair.publicKey()}\n`);
  return sharedChallenge;
};

const redeemChallenge = async (sponsorKeypair, transactionUuid) => {
  const redeemRet = await sdk.redeemChallenge(sponsorKeypair, transactionUuid);
  const redemptionTransaction = redeemRet.data.transaction;
  console.log(`Redeemed transaction ${redemptionTransaction.uuid}\n`);
  return redemptionTransaction;
};

const retrieveProvenanceChainFIFO = async (tokenTypeUuid, publicKey) => {
  const retProv = await sdk.retrieveProvenanceChainFIFO(tokenTypeUuid, publicKey);
  const provenanceChain = retProv.data;
  console.log(`Retrieved provenanceChain of oldest owned challenge of ${publicKey} for tokenType ${tokenTypeUuid}\n`);
  console.log(provenanceChain, '\n');
  return provenanceChain;
}

const shareChallenge = async (senderKeypair, receiverPublicKey, transactionUuid) => {
  const sharedChallengeRet = await sdk.shareChallenge(
    senderKeypair,
    transactionUuid,
    receiverPublicKey
  );
  const sharedChallenge = sharedChallengeRet.data.transaction;
  console.log(
    `${senderKeypair.publicKey()} shared the ${transactionUuid} challenge with ${receiverPublicKey}`
  );
  return shareChallenge;
};

const demo = async () => {
  try {
    const tokenTypeSponsor = sdk.createWalletAddress();
    const keypair2 = sdk.createWalletAddress();
    const keypair3 = sdk.createWalletAddress();
    const stampRet = await sdk.stampToken(
      tokenTypeSponsor.publicKey(),
      TOKEN_NAME,
      TOKEN_COUNT,
      EXPIRATION_YEAR
    );
    const stampedTokenType = stampRet.data.tokenType;
    console.log(
      `${tokenTypeSponsor.publicKey()} created tokenType with UUID ${stampedTokenType.uuid}\n`,
    );
    const sharedChallenge1 = await transferTokens(
      tokenTypeSponsor,
      stampedTokenType.uuid,
      keypair2,
      100
    );
    const sharedChallenge2 = await transferTokens(
      tokenTypeSponsor,
      stampedTokenType.uuid,
      keypair3,
      100
    );
    const sharedChallenge3 = await shareChallenge(
      keypair2,
      keypair3.publicKey(),
      sharedChallenge1.uuid
    );
    const provenanceChain1 = await retrieveProvenanceChainFIFO(
      stampedTokenType.uuid,
      keypair3.publicKey()
    );
    const redemptionTransaction1 = await redeemChallenge(
      tokenTypeSponsor,
      sharedChallenge2.uuid
    );
    const provenanceChain2 = await retrieveProvenanceChainFIFO(
      stampedTokenType.uuid,
      keypair3.publicKey()
    );
  } catch (e) {
    console.log(e);
  }
};

demo();
