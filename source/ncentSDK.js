const axios = require('axios');
const StellarSdk = require('stellar-sdk');
const signObject = require('./utils').signObject;

// const defaultNet = 'http://localhost:8010/api';
const defaultNet = "http://18.219.110.45:8010/api";

class ncentSDK {
  constructor(net = defaultNet) {
    this._net = net;
  }

  // createWalletAddress creates a new wallet for the user.
  // this presently relies upon Stellar's Keypair.random
  createWalletAddress() {
    return StellarSdk.Keypair.random();
  }

  // getWallets returns all wallets
  async getWallets() {
    return await axios.get(`${this._net}/wallets`);
  }

  // getWallet retrieves a specific wallet with a publicKey
  // (string) publicKey: public key of a wallet
  async getWallet(publicKey) {
    return await axios.get(`${this._net}/wallets/${publicKey}`);
  }

  // getWalletBalance retrieves a publicKey's balance of a TokenType
  // (string) publicKey: public key of a wallet
  // (string) tokenTypeUuid: UUID of a stamped TokenType
  async getWalletBalance(publicKey, tokenTypeUuid) {
    return await axios.get(
      `${this._net}/wallets/${publicKey}/${tokenTypeUuid}`
    );
  }

  // stampToken initiates a new token type and creates n of these tokens.
  // (string) publicKey: public key of wallet stamping token
  // (string) tokenName: Name of token the user wants to create.
  // (int) totalTokens: number of tokens to create.
  // (date) expiryDate: Date of expiration for token.
  async stampToken(publicKey, tokenName, totalTokens, expiryDate) {
    return await axios.post(`${this._net}/tokentypes`, {
      sponsorUuid: publicKey,
      name: tokenName,
      totalTokens,
      expiryDate
    });
  }

  // getTokenTypes returns all TokenTypes
  async getTokenTypes() {
    return await axios.get(`${this._net}/tokentypes`);
  }
  
  // getTokenTypeData returns data and transactions of a tokenType
  // (string) tokenTypeUuid: UUID of a TokenType
  async getTokenTypeData(tokenTypeUuid) {
    return await axios.get(`${this._net}/tokentypes/${tokenTypeUuid}`);
  }
  
  // getTransactions returns all Transactions
  async getTransactions() {
    return await axios.get(`${this._net}/transactions`);
  }

  // createChallenge allows a TokenType sponsor to create a challenge
  // this challenge can be transferred to other wallets as a transaction
  // (stellarKeyPair) senderKeyPair: Sender wallet with secretKey and public key
  // (string) tokenTypeUuid: UUID of owned TokenType
  // (int) amount: designated count of tokens to issue as part of challenge
  async createChallenge(senderKeypair, name, expiration, tokenTypeUuid, rewardAmount) {
    const messageObj = {
      rewardAmount,
      name,
      expiration,
      tokenTypeUuid
    };
    const senderPublicKey = senderKeypair.publicKey();
    const senderPrivateKey = senderKeypair._secretKey;
    messageObj.signed = signObject(messageObj, senderPrivateKey);
    return(
      await axios.post(`${this._net}/challenges/${senderPublicKey}`,
      messageObj
    ));
  }

  async retrieveChallenge(challengeUuid) {
    return await axios.get(`${this._net}/challenges/${challengeUuid}`);
  }

  // shareChallenge allows the owner of a challenge (transaction) to transfer it
  // (stellarKeyPair) senderKeyPair: Sender wallet with secretKey and public key
  // (string) transactionUuid: UUID of owned transaction (challenge)
  // (string) toAddress: public key to transfer ownership of challenge to
  async shareChallenge(senderKeypair, challengeUuid, toAddress) {
    const senderPublicKey = senderKeypair.publicKey();
    const senderPrivateKey = senderKeypair._secretKey;
    const messageObj = {
      fromAddress: senderPublicKey,
      toAddress
    };
    messageObj.signed = signObject(messageObj, senderPrivateKey);
    return(
      await axios.post(`${this._net}/transactions/${challengeUuid}`,
      messageObj
    ));
  }

  // redeemChallenge allows the owner of a TokenType to trigger redemption
  // (stellarKeyPair) ownerKeyPair: keypair of TokenType creator
  // (string) transactionUuid: UUID of owned transaction (challenge)
  async redeemChallenge(ownerKeypair, challengeUuid) {
    const ownerPrivateKey = ownerKeypair._secretKey;
    const messageObj = { challengeUuid };
    messageObj.signed = signObject(messageObj, ownerPrivateKey);
    return(
      await axios.post(`${this._net}/transactions/redeem`,
      messageObj
    ));
  }

  // retrieveProvenanceChain gets the parents of a transaction recursively
  // (string) transactionUuid: UUID of a transaction
  async retrieveProvenanceChain(transactionUuid) {
    return axios.get(`${this._net}/transactions/${transactionUuid}`);
  }

  // retrieveProvenanceChainFIFO gets the provenance of the oldest owned
  // transaction of a specific TokenType
  // (string) transactionUuid: UUID of a transaction
  // (string) publicKey: valid wallet public key
  async retrieveProvenanceChainFIFO(tokenTypeUUid, publicKey) {
    return axios.get(`${this._net}/transactions/${tokenTypeUUid}/${publicKey}`);
  }

  // retrieves all challenges sponsored by a wallet address
  // (string) publicKey: valid wallet public key
  async retrieveSponsoredChallenges(publicKey) {
    return axios.get(`${this._net}/challenges/sponsoredChallenges/${publicKey}`);
  }

  // retrieves all challenges held (but not sponsored) by a wallet address
  // (string) publicKey: valid wallet public key
  async retrieveHeldChallenges(publicKey) {
    return axios.get(`${this._net}/challenges/heldChallenges/${publicKey}`);
  }
}


module.exports = ncentSDK;