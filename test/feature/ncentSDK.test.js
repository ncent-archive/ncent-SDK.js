const mySDK = require('../../source/ncentSDK.js');
const sdk = new mySDK();

const INIT_WALLET_BALANCE = 10000;
const TRANSFER_AMOUNT = 10;

const wallet1 = sdk.createWalletAddress();
const wallet2 = sdk.createWalletAddress();

describe('createWallet', () => {
  it('returns a stellar keypair', () => {
    const publicKey = wallet1.publicKey();
    const secret = wallet1.secret();

    expect(typeof wallet1).toBe('object');
    expect(typeof publicKey).toBe('string');
    expect(publicKey.length).toBe(56);
    expect(typeof secret).toBe('string');
    expect(secret.length).toBe(56);
  });
});

let tokenId;

describe('stampToken', async () => {
  const tokenName = Math.random().toString(36).slice(2);
  let data;
  it ('creates a token with a wallet + token payload', async (done) => {
    const ret = await sdk.stampToken(
      wallet1.publicKey(),
      tokenName,
      INIT_WALLET_BALANCE,
      '2021',
    );
    data = ret.data;
    tokenId = data['token']['uuid'];
    expect(typeof data['wallet']).toBe('object');
    expect(typeof data['token']).toBe('object');
    done();
  })
  it('assign the owner wallet balance the total allocated tokens', () => {
    expect(data['wallet'].balance).toBe(data['token'].totalTokens);
  });
});

describe('transferToken', async () => {
  let data;
  it ('returns an object with a sender, receiver, and txn', async (done) => {
    const ret = await sdk.transferTokens(
        wallet1,
        wallet2.publicKey(),
        tokenId,
        TRANSFER_AMOUNT
    );
    data = ret.data;
    expect(typeof data['sender']).toBe('object');
    expect(typeof data['receiver']).toBe('object');
    expect(typeof data['txn']).toBe('object');
    done();
  })
  it('has a tokentype matching the transfer tokenId in transacation', () => {
    expect(data['txn']['tokentype_uuid']).toBe(tokenId);
  });
  it('has a tokentype matching the transfer tokenId in receiver', () => {
    expect(data['receiver']['tokentype_uuid']).toBe(tokenId);
  });
  it('has a tokentype matching the transfer tokenId in sender', () => {
    expect(data['sender']['tokentype_uuid']).toBe(tokenId);
  });
  it ('has a wallet_uuid matching the wallet that sent the tokens', () => {
    expect(data['sender']['wallet_uuid']).toBe(wallet1.publicKey());
  });
  it ('has a wallet_uuid matching the wallet that received the tokens', () => {
    expect(data['receiver']['wallet_uuid']).toBe(wallet2.publicKey());
  });
  it ('has an amount in the txn that matches the amount transferred', () => {
    expect(data['txn']['amount']).toBe(TRANSFER_AMOUNT);
  });
});

describe('getAllBalances', async () => {
  let data;
  let balance1;
  it ('returns an array of token balances', async (done) => {
    const ret = await sdk.getAllBalances(wallet1.publicKey());
    data = ret.data;
    balance1 = data[0];
    expect(typeof data).not.toBe('undefined');
    expect(typeof balance1).toBe('object');
    done();
  })

  it('has accurate balances for tokens in this array', () => {
    expect(balance1['balance']).toBe(INIT_WALLET_BALANCE - TRANSFER_AMOUNT);
  });
  it('has accurate wallet_uuids in this array', () => {
    expect(balance1['wallet_uuid']).toBe(wallet1.publicKey());
  });
  it('has accurate tokenIds in this array', () => {
    expect(balance1['tokentype_uuid']).toBe(tokenId);
  });
});

describe('getTokenBalance', async () => {
  let data;
  let balance1;
  // TODO modify test when API is corrected to return only one object
  it ('returns an array of token balances', async (done) => {
    const ret = await sdk.getTokenBalance(wallet1.publicKey(), tokenId);
    data = ret.data;
    balance1 = data[0];
    expect(typeof data).not.toBe('undefined');
    expect(typeof balance1).toBe('object');
    done();
  })

  it('has accurate balances for tokens in this array', () => {
    expect(balance1['balance']).toBe(INIT_WALLET_BALANCE - TRANSFER_AMOUNT);
  });
  it('has accurate wallet_uuids in this array', () => {
    expect(balance1['wallet_uuid']).toBe(wallet1.publicKey());
  });
  it('has accurate tokenIds in this array', () => {
    expect(balance1['tokentype_uuid']).toBe(tokenId);
  });
});
