const axios = require('axios');
const StellarSdk = require('stellar-sdk');
const signObject = require('./utils').signObject;

const testNet = 'http://localhost:8010/api';

class ncentSDK {
    constructor(net = testNet) {
        this._net = net;
    }

    /*
    * createWalletAddress creates a new wallet for the user.
    * this presently relies upon Stellar's Keypair.random
    */
    createWalletAddress() {
        let KeyPair = StellarSdk.Keypair.random();
        return KeyPair;
    }

    /*
    stampToken initiates a new token type and creates n of these tokens.
    (string) publicKey: publicKey of wallet stamping token
    (string) tokenName: Name of token the user wants to create.
    (int) numTokens: number of tokens to create.
    (date) expiryDate: Date of expiration for token.)
    (callback) resolve: invoked on success;
    (callback) reject: invoked on error;
    */
    stampToken(publicKey, tokenName, numTokens, expiryDate, resolve, reject) {
        axios.post(this._net + '/tokentypes', {
            sponsor_uuid: publicKey,
            Name: tokenName,
            totalTokens: numTokens,
            ExpiryDate: expiryDate,
        })
        .then((response) => {
            return resolve(response);
        })
        .catch((error) => {
            return reject(error);
        });
    }

    /*
    transferTokens allows tokens to be transferred between two parties.
    (stellarKeyPair) senderKeyPair: Sender wallet with secretKey and public key
    (string) receiverPublic: Public key of receiver
    (UUID) tokenTypeId: UUID of token the user is transferring.
    (int) tokenAmount: number of tokens to transfer.
    (callback) resolve: invoked on success;
    (callback) reject: invoked on error;
    */
    transferTokens(senderKeyPair, receiverPublic, tokentypeId, tokenAmount, resolve, reject) {
        const senderPrivate = senderKeyPair._secretKey;
        const messageObj = {
          fromAddress: senderKeyPair.publicKey(),
          toAddress: receiverPublic,
          amount: tokenAmount
        };
        const signed = signObject(messageObj, senderPrivate);
        axios.post(this._net + '/tokentypes/' + tokentypeId + '/items', {
            amount: tokenAmount,
            fromAddress: senderKeyPair.publicKey(),
            toAddress: receiverPublic,
            signed
        })
        .then((response) => {
            return resolve(response);
        })
        .catch((error) => {
            return reject(error);
        });
    }

    /*
    getTokenBalance gets the balance for any user's wallet.
    (string) publicKey: The wallet publicKey
    (UUID) tokenType: The uuid associated the the token you want to destroy.
    (callback) resolve: invoked on success;
    (callback) reject: invoked on error;
    */
    getTokenBalance(publicKey, tokenTypeUUID, resolve, reject) {
        axios.get(this._net + '/wallets/' + publicKey + '/' + tokenTypeUUID)
        .then((response) => {
            return resolve(response);
        })
        .catch((error) => {
            return reject(error);
        });
    }

    /*
    getAllBalances returns the balance for all tokens in a user's wallet.
    (string) publicKey: The wallet publicKey
    (callback) resolve: invoked on success;
    (callback) reject: invoked on error;
    */
    getAllBalances(publicKey, resolve, reject) {
        axios.get(this._net + '/wallets/' + publicKey, {})
        .then((response) => {
            return resolve(response);
        })
        .catch((error) => {
            return reject(error);
        });
    }

    /*
    getTokenTransactionHistory provides a history of outgoing and incoming
    transactions from a user's wallet for one token.
    string walletAddress: user's wallet address.
    int tokenType: UUID for token.
    params: any additional parameters.
    success: callback.
    error: callback.
    */
    // getTokenTransactionHistory(walletAddress, tokenType, params, success, error) {
    //     axios.get(this._net + '/balance', {
    //         params: {
    //             walletAddress: walletAddress,
    //             tokenType: tokenType
    //         }
    //     })
    //     .then(function(response){
    //         console.log(response);
    //     })
    //     .catch(function(error){
    //         console.log(error);
    //     })
    //     .then(function(){
    //     });
    // }

    // /*
    // getTransactionHistory provides a history of outgoing and incoming
    // transactions from a user's wallet for one token.
    // string walletAddress: user's wallet address.
    // params: any additional parameters.
    // success: callback.
    // error: callback.
    // */
    // getTransactionHistory(walletAddress, params, success, error) {
    //     axios.get(this._net + '/balance', {
    //         params: {
    //             walletAddress: walletAddress
    //         }
    //     })
    //     .then(function(response){
    //         console.log(response);
    //     })
    //     .catch(function(error){
    //         console.log(error);
    //     })
    //     .then(function(){

    //     });
    // }

    /*
    redeemToken redeems the token based off the specified redeem action
    written in the original contract.
    string walletAddress: creator's wallet address.
    string redeemerSignature: redeemer's signature.
    string sponsorSignature: sponsor signature.
    int tokenType: UUID for tokenType.
    int numRedeem: number of tokens to redeem.
    params: any additional parameters.
    success: callback.
    error: callback.
    */

    // redeemToken(walletAddress, redeemerSignature, sponsorSignature,
    //        tokenType, numRedeem, params, success, error) {
    //    axios.post(this._net + '/transaction')
    //         .then(function(response){
    //            console.log(response);
    //        })
    //        .catch(function(error){
    //            console.log(error);
    //        });
    // }
    /*
    destroyTokens destroys all tokens of a certain tokenType.
    (stellarKeyPair) sponsorKeyPair: User's wallet with secretKey and public key
    (string) tokentypeId: The uuid associated the the token you want to destroy.
    (callback) resolve: invoked on success;
    (callback) reject: invoked on error;
    */
    // destroyTokens(sponsorKeyPair, tokentypeId, resolve, reject) {
    //     const sponsorPrivate = sponsorKeyPair._secretKey;
    //     const messageObj = {tokentype_id: tokentypeId};
    //     const signed = signObject(messageObj, sponsorPrivate);
    //
    //     axios.put(this._net+ '/tokentypes/' + tokentypeId, {
    //         signed,
    //         publicKey: sponsorKeyPair.publicKey()
    //     })
    //     .then((response) => {
    //         return resolve(response);
    //     })
    //     .catch((error) => {
    //         return reject(error);
    //     });
    // }

}

module.exports = ncentSDK;
