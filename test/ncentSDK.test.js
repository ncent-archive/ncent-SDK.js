global.Buffer.prototype.__proto__ = global.Uint8Array.prototype;
const mySDK = require('../source/ncentSDK.js');
const sdk = new mySDK('http://18.219.87.29:8010/api');

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
    1000000,
    '2021',
    handleToken,
    (reject)=>{console.log(reject); expect(false).toBe(true); done();}
  );
});

test('transferTokens transfers tokens from one wallet to another', done => {
  const handleTransfer = (resolve) => {
    const data = resolve.data;
    console.log(data);
    done();
  };

  sdk.transferTokens(
    wallet1,
    wallet2.publicKey(),
    tokenId,
    10,
    handleTransfer,
    (reject)=>{console.log(reject); expect(false).toBe(true); done();}
  );
}, 15000);
