# ncentSDK

 * [Overview](#overview)
 * [Installation](#install)
 * [Documentation](#documentation)
 * [Usage Example](#usage)
 * [Contribute](#contributing)

## Overview

ncentSDK is a Javascript library built for developers to easily integrate their applications with the nCent API and Sandbox test environment. It provides the tools for building and signing transactions, communicating with the backend API, and submitting transactions or querying network history.

This documentation is meant to serve as a guide for developers to understand all of the functionality available in the SDK.

 * [createWalletAddress](#createwalletaddress)
 * [getWallets](#getwallets)
 * [getWallet](#getwallet)
 * [getWalletBalance](#getwalletbalance)
 * [getTokenTypes](#gettokentypes)
 * [stampToken](#createwalletaddress)
 * [getTokenTypeData](#gettokentypedata)
 * [getTransactions](#gettransactions)
 * [createChallenge](#createchallenge)
 * [shareChallenge](#sharechallenge)
 * [redeemChallenge](#redeemchallenge)
 * [redeemProvenanceChain](#retrieveprovenancechain)
 * [redeemProvenanceChainFIFO](#retrieveprovenancechainfifo)


## Install

### To use as a module in a Node.js project
1. Install it using npm:
  ```shell
  npm i ncent-sandbox-sdk
  ```

2. require/import it:
  ```js
  const nCentSDK = require('ncent-sandbox-sdk');
  ```


### To develop and test the SDK:

1. Clone the repository:

  ```shell
  git clone https://github.com/ncent/ncent-SDK.js
  ```

2. Install dependencies inside our ncentSDK folder:
  ```shell
  cd ncent-SDK.js
  npm install
  ```

# Documentation

## Constructor
#### `new ncentSDK(ip_address)`

### Description:
Create an instance of the nCent SDK class, specifying the IP of the Sandbox instance with which you will communicate.  
### Parameters:
Name  | Type | Description
--- | --- | ---
ip_address | String | Network on which to connect to the API. This defaults to the IP of the Sandbox hosted on AWS ECS. If you are running the sandbox locally, pass `http://localhost:8010/api`

<br />

- - - -

<br />

## Methods

 * [createWalletAddress](#createwalletaddress)
 * [getWallets](#getwallets)
 * [getWallet](#getwallet)
 * [getWalletBalance](#getwalletbalance)
 * [getTokenTypes](#gettokentypes)
 * [stampToken](#createwalletaddress)
 * [getTokenTypeData](#gettokentypedata)
 * [getTransactions](#gettransactions)
 * [createChallenge](#createchallenge)
 * [retrieveChallenge](#retrievechallenge)
 * [shareChallenge](#sharechallenge)
 * [redeemChallenge](#redeemchallenge)
 * [redeemProvenanceChain](#retrieveprovenancechain)
 * [redeemProvenanceChainFIFO](#retrieveprovenancechainfifo)
 * [retrieveSponsoredChallenges](#retirevesponsoredchallenges)
 * [retrieveHeldChallenges](#retrieveheldchallenges)

<br />

- - - -

<br />

### `createWalletAddress`
##### `createWalletAddress()`
### Description:
Creates a KeyPair object.
### Parameters:
None

- - - -
<br />

- - - -
### `getWallets`
##### `getWallets()`
### Description:
Retrieves all wallets
### Parameters:
None

- - - -
<br />

- - - -
### `getWallet`
##### `getWallet(publicKey)`
### Description:
Retrieves a specific wallet
### Parameters:
Name  | Type | Description
--- | --- | ---
publicKey | String | Valid public key associated with a wallet

- - - -
<br />

- - - -
### `getWalletBalance`
##### `getWalletBalance(publicKey, tokenTypeUuid)`
### Description:
Retrieves a specific wallet's balance of a stamped TokenType
### Parameters:
Name  | Type | Description
--- | --- | ---
publicKey | String | Valid public key associated with a wallet
tokenTypeUuid | String | UUID of a stamped TokenType


- - - -
<br />

- - - -

### `stampToken`
##### `stampToken(publicKey, tokenName, totalTokens, expiryDate)`
### Description:
Initiates a new token type and creates totalTokens amount of these tokens.
Note: For development, one can stamp tokens out of nothing, and thus stampTokens can be used to instantiate new tokens for free. In the production version of our SDK, only ncnt will be allowed to be stamped into new tokens.
### Parameters:
Name  | Type | Description
--- | --- | ---
publicKey | String | public key of wallet stamping token
tokenName | String | Name of token the user wants to create.
numTokens | int | Number of tokens to create.
expiryData | int | Date of expiration for token.

- - - -
<br />

- - - -
### `getTokenTypes`
##### `getTokenTypes()`
### Description:
returns all TokenTypes
### Parameters:
none

- - - -
<br />

- - - -

### `getTokenTypeData`
##### `getTokenTypeData(tokenTypeUuid)`
### Description:
returns data and transactions of a tokenType
### Parameters:
Name  | Type | Description
--- | --- | ---
tokenTypeUuid | String | UUID of a stamped TokenType

- - - -
<br />

- - - -

### `getTransactions`
##### `getTransactions`
### Description:
returns all Transactions
### Parameters:
none

- - - -
<br />

- - - -
### `createChallenge`
##### `createChallenge(senderKeyPair, name, expiration, tokenTypeUUid, rewardAmount)`
### Description:
Allows a sponsor to create a challenge. This challenge can be transferred to other wallets via a transaction
### Parameters:
Name  | Type | Description
--- | --- | ---
senderKeyPair | stellarKeyPair | Sender wallet with secretKey and public key
name | String | the name of the challenge to be created
expiration | Date | the expiration date of the challenge
tokenTypeUuid | String | UUID of owned TokenType
rewardAmount | Integer | designated number of tokens to reward for the completion of the challenge
- - - -
<br />

- - - -
### `retrieveChallenge`
##### `retrieveChallenge(challengeUuid)`
### Description:
Retrieves data for a specific challenge
### Parameters:
Name  | Type | Description
--- | --- | ---
challengeUuid | String | UUID of a specific challenge
- - - -
<br />

- - - -
### `shareChallenge`
##### `shareChallenge(senderKeyPair, challengeUuid, toAddress)`
### Description:
Allows the current holder of a challenge to transfer it
### Parameters:
Name  | Type | Description
--- | --- | ---
senderKeyPair | stellarKeyPair | Sender wallet with secretKey and public key
challengeUuid | String | UUID of the challenge
toAddress | String | public key to transfer ownership of challenge to
- - - -
<br />

- - - -
### `redeemChallenge`
##### `redeemChallenge(ownerKeyPair, challengeUuid)`
### Description:
Allows the sponsor of a challenge to trigger redemption. This will create a transaction between the current challenge holder and Token Graveyard.
### Parameters:
Name  | Type | Description
--- | --- | ---
ownerKeyPair | stellarKeyPair | Sponsor wallet with secretKey and public key
challengeUuid | String | UUID of the challenge to be redeemed
- - - -
<br />

- - - -
### `retrieveProvenanceChain`
##### `retrieveProvenanceChain(transactionUuid)`
### Description:
Gets the parents of a transaction recursively
### Parameters:
Name  | Type | Description
--- | --- | ---
transactionUuid | String | UUID of a transaction (challenge)
- - - -
<br />

- - - -
### `retrieveProvenanceChainFIFO`
##### `retrieveProvenanceChainFIFO(tokenTypeUUid, publicKey)`
### Description:
Gets the provenance of the oldest received transaction (challenge) of a specific TokenType that has not been shared. 
### Parameters:
Name  | Type | Description
--- | --- | ---
publicKey| String | valid wallet public key
tokenTypeUuid | String | UUID of a stamped TokenType
- - - -
<br />

- - - -
### `retrieveSponsoredChallenges`
##### `retrieveSponsoredChallenges(publicKey)`
### Description:
Retrieves all challenges (and their data) that have been sponsored by the public key provided 
### Parameters:
Name  | Type | Description
--- | --- | ---
publicKey| String | valid wallet public key
- - - -
<br />

- - - -
### `retrieveHeldChallenges`
##### `retrieveHeldChallenges(publicKey)`
### Description:
Retrieves all challenges (and their data) that are currently in the possession of the public key provided 
### Parameters:
Name  | Type | Description
--- | --- | ---
publicKey| String | valid wallet public key
- - - -
<br />

- - - -
## Usage
Check the [examples](./examples) folder for usage examples.

## Contributing
For information on how to contribute, please email kk@ncnt.io

------------
