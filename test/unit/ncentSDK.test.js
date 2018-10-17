const nCentSDK = require('../../source/ncentSDK.js');
const sdk = new nCentSDK("http://localhost:8010/api");
const StellarSdk = require("stellar-sdk");
const moxios = require('moxios');
const axios = require('axios');

describe('nCentSDK', () => {

  beforeEach(() => {
    moxios.install(axios);
  });
  
  afterEach(() => {
    moxios.uninstall(axios);
  });

  describe('createWalletAddress', () => {
    let wallet;
  
    beforeEach(async done => {
      wallet = await sdk.createWalletAddress();
      done();
    });

    it('returns a stellar keypair', () => {
      const publicKey = wallet.publicKey();
      const secret = wallet.secret();

      expect(typeof wallet).toBe('object');
      expect(typeof publicKey).toBe('string');
      expect(publicKey.length).toBe(56);
      expect(typeof secret).toBe('string');
      expect(secret.length).toBe(56);
    });
  });

  describe('getWallets', () => {
    it('sends a GET request to /api/wallets', async done => {
      moxios.stubRequest("http://localhost:8010/api/wallets", {
        status: 200,
        response: [{ wallet: {} }, { wallet: {} }]
      });
      const wallets = await sdk.getWallets();
      expect(wallets.data.length).toBe(2);
      done();
    })
  });

  describe('getWallet', () => {
    it('sends a GET request to /api/wallets/{publicKey}', async done => {
      const publicKey = StellarSdk.Keypair.random().publicKey();
      moxios.stubRequest(`http://localhost:8010/api/wallets/${publicKey}`, {
          status: 200,
          response: { publicKey }
      });
      const wallet = await sdk.getWallet(publicKey);
      expect(wallet.data.publicKey).toBe(publicKey);
      done();
    });
  });

  describe('getWalletBalance', () => {
    it("sends a GET request to /api/wallets/{publicKey}/{tokenTypeUuid}", async done => {
      const publicKey = StellarSdk.Keypair.random().publicKey();
      const tokenTypeUuid = '2c22a6a2-b1a8-4cba-a67b-382bcede0dcc';
      moxios.stubRequest(`http://localhost:8010/api/wallets/${publicKey}/${tokenTypeUuid}`, {
        status: 200,
        response: { balance: 1337 }
      });
      const wallet = await sdk.getWalletBalance(publicKey, tokenTypeUuid);
      expect(wallet.data.balance).toBe(1337);
      done();
    });
  });

  describe('stampToken', () => {
    it("sends a POST request w/ body to /api/tokentypes/", async done => {
      const publicKey = StellarSdk.Keypair.random().publicKey();
      moxios.wait(() => {
        let request = moxios.requests.mostRecent();
        expect(request.config.method).toBe('post');
        const body = JSON.parse(request.config.data);
        expect(body.sponsorUuid).toBe(publicKey);
        expect(body.name).toBe('NAME');
        expect(body.totalTokens).toBe(1000);
        expect(body.expiryDate).toBe('2026');
        done();
      });
      sdk.stampToken(publicKey, 'NAME', 1000, '2026');
    });
  });

  describe('getTokenTypes', () => {
    it("sends a GET request to /api/tokentypes/", async done => {
      moxios.stubRequest(`http://localhost:8010/api/tokentypes`, {
        status: 200,
        response: [{}, {}, {}]
      });
      const res = await sdk.getTokenTypes();
      expect(res.data.length).toBe(3);
      done();
    });
  });

  describe('getTokenTypeData', () => {
    it ("sends a GET request to /api/tokentypes/{tokenTypeUUID}", async done => {
      const mockUUID = "2c22a6a2-b1a8-4cba-a67b-382bcede0dcc";
      moxios.stubRequest(`http://localhost:8010/api/tokentypes/${mockUUID}`, {
        status: 200,
        response: { mockUUID }
      });
      const res = await sdk.getTokenTypeData(mockUUID);
      expect(res.data.mockUUID).toBe(mockUUID);
      done();
    });
  });

  describe('getTransactions', () => {
    it ("sends a GET request to /api/transactions", async done => {
      moxios.stubRequest(`http://localhost:8010/api/transactions`, {
        status: 200,
        response: [{}, {}, {}, {}]
      });
      const res = await sdk.getTransactions();
      expect(res.data.length).toBe(4);
      done();
    });
  });

  describe('createChallenge', () => {
    it("sends a POST request w/ body to api/transactions/{tokenTypeUUid}/{pubKey}", async done => {
      const keypair = StellarSdk.Keypair.random();
      const tokenTypeUuid = "2c22a6a2-b1a8-4cba-a67b-382bcede0dcc";
      const amount = 1000;
      moxios.wait(() => {
        let request = moxios.requests.mostRecent();
        expect(request.config.method).toBe("post");
        const body = JSON.parse(request.config.data);
        expect(body.signed).not.toBe(undefined);
        expect(body.amount).toBe(amount);
        done();
      });
      await sdk.createChallenge(keypair, tokenTypeUuid, amount);
    });
  });

  describe('shareChallenge', () => {
    it("sends a POST request w/ body to api/transactions/{transactionUuid}", async done => {
      const keypair = StellarSdk.Keypair.random();
      const keypair2 = StellarSdk.Keypair.random();
      const transactionUuid = "2c22a6a2-b1a8-4cba-a67b-382bcede0dcc";
      moxios.wait(() => {
        let request = moxios.requests.mostRecent();
        expect(request.config.method).toBe("post");
        const body = JSON.parse(request.config.data);
        expect(body.signed).not.toBe(undefined);
        expect(body.fromAddress).toBe(keypair.publicKey());
        expect(body.toAddress).toBe(keypair2.publicKey());
        done();
      });
      await sdk.shareChallenge(keypair, transactionUuid, keypair2.publicKey());
    });
  });

  describe('redeemChallenge', () => {
    it("sends a POST request w/ body to api/transactions/redeem", async done => {
      const keypair = StellarSdk.Keypair.random();
      const transactionUuid = "2c22a6a2-b1a8-4cba-a67b-382bcede0dcc";
      moxios.wait(() => {
        let request = moxios.requests.mostRecent();
        expect(request.config.method).toBe("post");
        const body = JSON.parse(request.config.data);
        expect(body.signed).not.toBe(undefined);
        expect(body.transactionUuid).toBe(transactionUuid);
        done();
      });
      await sdk.redeemChallenge(keypair, transactionUuid);
    });
  });

  describe('retrieveProvenanceChain', () => {
    const transactionUuid = "2c22a6a2-b1a8-4cba-a67b-382bcede0dcc";
    it("sends a GET request to /api/transactions/{transactionUuid}", async done => {
      moxios.stubRequest(`http://localhost:8010/api/transactions/${transactionUuid}`, {
        status: 200,
        response: [{}, {}, {}, {}, {}]
      });
      const res = await sdk.retrieveProvenanceChain(transactionUuid);
      expect(res.data.length).toBe(5);
      done();
    });
  });
  
  describe('retrieveProvenanceChainFIFO', () => {
    const publicKey = StellarSdk.Keypair.random().publicKey();
    const tokenTypeUuid = "2c22a6a2-b1a8-4cba-a67b-382bcede0dcc";
    it("sends a GET request to /api/transactions/{transactionUuid}", async done => {
      moxios.stubRequest(
        `http://localhost:8010/api/transactions/${tokenTypeUuid}/${publicKey}`,
        {
          status: 200,
          response: [{}, {}, {}, {}, {}, {}]
        }
      );
      const res = await sdk.retrieveProvenanceChainFIFO(tokenTypeUuid, publicKey);
      expect(res.data.length).toBe(6);
      done();
    });
  });
});