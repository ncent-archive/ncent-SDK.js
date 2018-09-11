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

In our initial version, we will provide support for:

 * [createWalletAddress](#createwalletaddress)
 * [transferTokens](#transfertokens)
 * [getAllBalances](#getallbalances)
 * [getTokenBalance](#gettokenbalance)
 * [stampToken](#stamptoken)

 In our next version, there will be support for
 - getAllTransactionHistory
 - getTokenTransactionHistory
 - redeemToken


## Install

### To use as a module in a Node.js project
1. Install it using npm:
  ```shell
  npm i ncent-sandbox-sdk
  ```

2. require/import it in your JavaScript:
  ```js
  const nCentSDK = require('ncent-sandbox-sdk');
  ```

In the event the above does not work, please contact us to get help resolving your issue.


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
 * [transferTokens](#transfertokens)
 * [getAllBalances](#getallbalances)
 * [getTokenBalance](#gettokenbalance)
 * [stampToken](#stamptoken)

<br />

- - - -

<br />

### `createWalletAddress`
##### `createWalletAddress()`
### Description:
Create a KeyPair object.
### Parameters:
None
### Returns:
A Keypair object similar to the [Stellar Keypair object](https://stellar.github.io/js-stellar-sdk/Keypair.html#.random).

- - - -
<br />

- - - -

### `transferTokens`
##### `transferTokens(sender_KeyPair, receiver_public, tokentype_id, tokenAmount, resolve, reject)`
### Description:
Transfer tokens of a specific type from one wallet to another.
### Parameters:
Name  | Type | Description
--- | --- | ---
sender_KeyPair | Keypair Object | A Stellar KeyPair object with a valid public/private key pair. Can come from the nCentSDK or StellarSDK
receiver_public | String | The public key of the receiver. A valid Base32 Stellar private key. Eg: receiver_keypair.publicKey()
tokentype_id | String | id representing the Stamped TokenType to be transfered
tokenAmount | int | Integer representing the number of tokens to be transfered

- - - -
<br />

- - - -

### `getAllBalances`
##### `getAllBalances(walletAddress, resolve, reject)`
### Description:
Retrieve all token balances for a specific wallet address.
### Parameters:
Name  | Type | Description
--- | --- | ---
walletAddress | String | Valid wallet public key

- - - -
<br />

- - - -

### `getTokenBalance`
##### `getTokenBalance(walletAddress, tokentype_id, resolve, reject)`
### Description:
Retrieve all token balances for a specific wallet address.
### Parameters:
Name  | Type | Description
--- | --- | ---
walletAddress | String | Valid wallet public key

- - - -
<br />

- - - -

### `stampToken`
##### `stampToken(walletAddress, tokenName, numTokens, ExpiryDate, resolve, reject)`
### Description:
Add numTokens of a new token type to a given wallet address. Response object contains the unique tokenType Id which is necessary to know for other SDK functions.
Note: For development, one can stamp tokens out of nothing, and thus stampTokens can be used to instantiate new ncnt tokens in a completely new  development environment. In the production version of our SDK, only existant ncnt will be allowed to be stamped into new tokens.
### Parameters:
Name  | Type | Description
--- | --- | ---
walletAddress | String | Valid public key / wallet identifier to which the new stamped tokens will be added
tokenName | String | Name of the newly stamped tokens.
numTokens | int | Integer representing the number of tokens that will be stamped into existence

- - - -
<br />

- - - -

## Usage
``` javascript
const nCentSDK = require('ncent-sandbox-sdk');

const sdk = new nCentSDK();

const TOKEN_NAME = 'TokenName'; // MUST BE UNIQUE
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
```

## Contributing
For information on how to contribute, please email kk@ncnt.io, mb@ncnt.io, or af@ncnt.io

## License
SDK is licensed under ...

------------
