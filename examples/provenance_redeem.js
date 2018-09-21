const nCentSDK = require("../source/ncentSDK");
// const nCentSDK = require('ncent-sandbox-sdk');

const sdk = new nCentSDK();

const TOKEN_NAME = "TokenName"; // MUST BE UNIQUE
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
  console.log(provenanceChain);
  return provenanceChain;
}

const retrieveProvenanceChain = async (transactionUuid) => {
  const retProv = await sdk.retrieveProvenanceChain(transactionUuid);
  const provenanceChain = retProv.data;
  console.log(`Retrieved provenanceChain of transaction ${transactionUuid}:`);
  console.log(provenanceChain);
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

const getAllWallets = async () => {
  const allWalletsRet = await sdk.getWallets();
  const allWallets = allWalletsRet.data;
  console.log('Wallets with the following addresses are persisted:');
  allWallets.forEach((wallet) => {
    console.log(wallet.address);
  });
  return allWallets;
}

const retrieveBalances = async (walletArray, tokenTypeUuid) => {
  const balances = [];
  for (let i = 0; i < walletArray.length; i++) {
    const walletAddress = walletArray[i].address;
    const walletBalanceRet = await sdk.getWalletBalance(walletAddress, tokenTypeUuid);
    const walletBalance = walletBalanceRet.data.balance;
    balances.push(walletBalance);
    console.log(`Balance for ${walletAddress}: ${walletBalance}`);
  }
  return balances;
};

const getTokenTypes = async () => {
  const tokenTypesRet = await sdk.getTokenTypes();
  const tokenTypes = tokenTypesRet.data;
  for (let i = 0; i < tokenTypes.length; i++) {
    console.log(`Token Type #${i}: ${tokenTypes[i].uuid}`);
  }
  return tokenTypes;
}

const getTokenTypeData = async (tokenTypeUuid) => {
  const tokenTypeDataRet = await sdk.getTokenTypeData(tokenTypeUuid);
  const tokenTypeData = tokenTypeDataRet.data;
  const tokenTypeTransactions = tokenTypeData.transactions;
  console.log(tokenTypeData);
  console.log(`Data for tokenType ${tokenTypeData.uuid}:`);
  console.log(`Transactions:`);
  tokenTypeTransactions.forEach((transaction) => {
    console.log(transaction);
  });
  return tokenTypeData;
}

const getAllTransactions = async () => {
  const ret = await sdk.getTransactions();
  const allTransactions = ret.data;
  console.log('All Transactions:');
  console.log(allTransactions);
  return allTransactions;
}

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
    const allTokenTypes = await getTokenTypes();
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
    const allWallets1 = await getAllWallets();
    const allWalletBalances1 = await retrieveBalances(allWallets1, stampedTokenType.uuid);
    const sharedChallenge3 = await shareChallenge(
      keypair2,
      keypair3.publicKey(),
      sharedChallenge1.uuid
    );
    const allWallets2 = await getAllWallets();
    const allWalletBalances2 = await retrieveBalances(allWallets2, stampedTokenType.uuid);
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
    const allWallets3 = await getAllWallets();
    const allWalletBalances3 = await retrieveBalances(allWallets3, stampedTokenType.uuid);
    const tokenTypeData = await getTokenTypeData(stampedTokenType.uuid);
    const allTransactions = await getAllTransactions();
    const provenanceChain3 = await retrieveProvenanceChain(redemptionTransaction1.uuid);
  } catch (e) {
    console.log(e);
  }
};

demo();
