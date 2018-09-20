# ncentSDK

 * [Overview](#overview)
 * [Installation](#install)
 * [Documentation](#documentation)
 * [Usage Example](#usage)
 * [Contribute](#contributing)

## Overview

ncentSDK is a Javascript library for communicating with the nCent API. It is used for building nCent applications either on Node.js or in the browser, as well as for accessing base-level features on the API.

It provides:
- a networking layer for endpoints on the back-end API.
- eventual facilities for building and signing transactions, for communicating with the backend API, and for submitting transactions or querying network history.

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

1. Clone the repo:

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
ip_address | String | Network on which to connect to the API. This defaults to the IP of the Sandbox hosted on AWS. If you are running the sandbox locally, pass `http://localhost:8010/api`

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
 * [shareChallenge](#sharechallenge)
 * [redeemChallenge](#redeemchallenge)
 * [redeemProvenanceChain](#retrieveprovenancechain)
 * [redeemProvenanceChainFIFO](#retrieveprovenancechainfifo)

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
##### `createChallenge(senderKeyPair, tokenTypeUUid, amount)`
### Description:
Allows a TokenType sponsor to create a challenge. This challenge can be transferred to other wallets as a transaction
### Parameters:
Name  | Type | Description
--- | --- | ---
senderKeyPair | stellarKeyPair | Sender wallet with secretKey and public key
tokenTypeUuid | String | UUID of owned TokenType
amount | Integer | designated count of tokens to issue as part of challenge
- - - -
<br />

- - - -
### `shareChallenge`
##### `shareChallenge(senderKeyPair, transactionUuid, toAddress)`
### Description:
Allows the owner of a challenge (transaction) to transfer it
### Parameters:
Name  | Type | Description
--- | --- | ---
senderKeyPair | stellarKeyPair | Sender wallet with secretKey and public key
transactionUuid | String | UUID of owned transaction (challenge)
toAddress | String | public key to transfer ownership of challenge to
- - - -
<br />

- - - -
### `redeemChallenge`
##### `redeemChallenge(ownerKeyPair, transactionUuid)`
### Description:
Allows the owner of a TokenType to trigger redemption. This will create a transaction between the current challenge owner and Token Graveyard.
### Parameters:
Name  | Type | Description
--- | --- | ---
ownerKeyPair | stellarKeyPair | Owner wallet with secretKey and public key
transactionUuid | String | UUID of owned transaction (challenge)
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
## Usage
Check the [examples](./examples) folder for usage examples.

## Contributing
For information on how to contribute, please email kk@ncnt.io, mb@ncnt.io, or af@ncnt.io

## License
SDK is licensed under ...

------------
