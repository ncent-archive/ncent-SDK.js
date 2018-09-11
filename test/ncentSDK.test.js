// This line overrides the jest buffer's prototype for compatability with nacl
Object.setPrototypeOf(global.Buffer.prototype, global.Uint8Array.prototype);

const mySDK = require('../source/ncentSDK.js');
const sdk = new mySDK();
const INIT_WALLET_BALANCE = 10000;
const TRANSFER_AMOUNT = 10;

const wallet1 = sdk.createWalletAddress();
const wallet2 = sdk.createWalletAddress();

test('createWallet returns a stellar keypair', () => {
  const publicKey = wallet1.publicKey();
  const secret = wallet1.secret();

  expect(typeof wallet1).toBe('object');
  expect(typeof publicKey).toBe('string');
  expect(publicKey.length).toBe(56);
  expect(typeof secret).toBe('string');
  expect(secret.length).toBe(56);
});

/*
  {
    token: {
      uuid: '31587016-a3ea-438f-818e-a911fbbf85d5',
      Name: 'bbbbbb',
      ExpiryDate: '2021-01-01T00:00:00.000Z',
      sponsor_uuid: 'GDD4ZNYKOA2X2S5IFUPVZ5UJ73XWL534EWF66HOGDN4WLYASDLDANDRB',
      totalTokens: 1000000,
    },
    wallet: {
      uuid: '81ab8719-e3a1-4799-bed2-99e40dc0ad6a',
      wallet_uuid: 'GDD4ZNYKOA2X2S5IFUPVZ5UJ73XWL534EWF66HOGDN4WLYASDLDANDRB',
      tokentype_uuid: '31587016-a3ea-438f-818e-a911fbbf85d5',
      balance: 1000000,
    }
  }
*/

let tokenId;

test('stampToken returns an object with a wallet and token payload', done => {
  const tokenName = Math.random().toString(36).slice(2);
  const handleToken = (resolve) => {
    const data = resolve.data;
    expect(typeof data['token']).toBe('object');
    expect(typeof data['wallet']).toBe('object');
    expect(data['wallet'].balance).toBe(data['token'].totalTokens);
    tokenId = data['token']['uuid'];
    done();
  };
  sdk.stampToken(
    wallet1.publicKey(),
    tokenName,
    INIT_WALLET_BALANCE,
    '2021',
    handleToken,
    (reject)=>{ console.log(reject); expect(false).toBe(true); done(); }
  );
});

/*
{ sender:
   { uuid: '6fa8f3ad-7c35-4f6f-b274-7e9c714877fd',
     wallet_uuid: 'GDTIV2VQMV4A43FEV4ZFFYQKYO2RZDMZ3Y7WST2YDVL2ITMY6HLDI5EC',
     tokentype_uuid: 'be26a7a0-032b-4565-8518-b6bf169a58da',
     balance: 999990,
     createdAt: '2018-09-11T17:06:33.413Z',
     updatedAt: '2018-09-11T17:06:33.686Z' },
  receiver:
   { uuid: '10f7282f-3146-4a0a-bd75-a5bcb0e04808',
     balance: 10,
     wallet_uuid: 'GB4UIDFC4JWK7GE72SNCGFKAICKFN5RYUEBUXRCZO4Q2QHTWMNPDEO3M',
     tokentype_uuid: 'be26a7a0-032b-4565-8518-b6bf169a58da',
     updatedAt: '2018-09-11T17:06:33.692Z',
     createdAt: '2018-09-11T17:06:33.689Z' },
  txn:
   { uuid: '988644c1-2926-42e0-af63-169cdaeb80ae',
     amount: 10,
     fromAddress: 'GDTIV2VQMV4A43FEV4ZFFYQKYO2RZDMZ3Y7WST2YDVL2ITMY6HLDI5EC',
     toAddress: 'GB4UIDFC4JWK7GE72SNCGFKAICKFN5RYUEBUXRCZO4Q2QHTWMNPDEO3M',
     tokentype_uuid: 'be26a7a0-032b-4565-8518-b6bf169a58da',
     updatedAt: '2018-09-11T17:06:33.694Z',
     createdAt: '2018-09-11T17:06:33.694Z' } }
*/

test('transferTokens transfers tokens from one wallet to another', done => {
  const handleTransfer = (resolve) => {
    const data = resolve.data;
    expect(typeof data['sender']).toBe('object');
    expect(typeof data['receiver']).toBe('object');
    expect(typeof data['txn']).toBe('object');
    expect(data['txn']['tokentype_uuid']).toBe(tokenId);
    expect(data['receiver']['tokentype_uuid']).toBe(tokenId);
    expect(data['sender']['tokentype_uuid']).toBe(tokenId);
    expect(data['sender']['wallet_uuid']).toBe(wallet1.publicKey());
    expect(data['receiver']['wallet_uuid']).toBe(wallet2.publicKey());
    expect(data['txn']['amount']).toBe(TRANSFER_AMOUNT);
    done();
  };
  sdk.transferTokens(
    wallet1,
    wallet2.publicKey(),
    tokenId,
    TRANSFER_AMOUNT,
    handleTransfer,
    (reject)=>{ console.log(reject); expect(false).toBe(true); done(); }
  );
});

/*
[ { uuid: '38f7f0ab-01a2-4775-abb5-c4fef7072a86',
    wallet_uuid: 'GBN32PSHHVRN2DEFDK3GOGLDUZBCYOVG3MFL6QOZNLXSSTTUSUWA4GTL',
    tokentype_uuid: '9ecf4655-a6ba-483b-81c8-d3d00d1bde44',
    balance: 999990,
    createdAt: '2018-09-11T17:49:17.983Z',
    updatedAt: '2018-09-11T17:49:18.246Z' } ]
*/
test('getTokenBalance gets balance for a specific token from wallet', done => {
  const handleTokenBalanceCheck = (resolve) => {
    const tokenBalance = resolve.data[0];
    expect(tokenBalance['balance']).toBe(INIT_WALLET_BALANCE - TRANSFER_AMOUNT);
    expect(tokenBalance['wallet_uuid']).toBe(wallet1.publicKey());
    expect(tokenBalance['tokentype_uuid']).toBe(tokenId);
    done();
  };
  sdk.getTokenBalance(
    wallet1.publicKey(),
    tokenId,
    handleTokenBalanceCheck,
    (reject)=>{ console.log(reject); expect(false).toBe(true); done(); }
  );
});

test('getAllBalances retrieves all token balances for a wallet', done => {
  const verifyGetAllBalances = (resolve) => {
    const data = resolve.data[0];
    // TODO change this once the sandbox only returns an object rather than arr
    expect(data['balance']).toBe(INIT_WALLET_BALANCE - TRANSFER_AMOUNT);
    expect(data['wallet_uuid']).toBe(wallet1.publicKey());
    expect(data['tokentype_uuid']).toBe(tokenId);
    done();
  };

  sdk.getAllBalances(
    wallet1.publicKey(),
    verifyGetAllBalances,
    (reject)=>{ console.log(reject); expect(false).toBe(true); done(); }
  );
});
