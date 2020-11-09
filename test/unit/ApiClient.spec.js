/// <reference path="../../index.d.ts" />
require('dotenv').config();
const assert = require('assert');
const NodeCache = require('node-cache');
const { Methods } = require('http-headers-js');
const ApiClientService = require('../../src/services/ApiClient');

const {
  INSURANCE_API_CLIENT_ID,
  INSURANCE_API_CLIENT_SECRET,
  INSURANCE_API_URL
} = process.env;
const LOGIN_CREDENTIAL = /** @type {Insurance.Credential} */ ({
  client_id: INSURANCE_API_CLIENT_ID,
  client_secret: INSURANCE_API_CLIENT_SECRET
});
const clients = require('../fixtures/clients');
const policies = require('../fixtures/policies');

const TOKEN = 'TOKEN';

describe('helpers/insuranceApiClient', () => {
  it('should load a token from XHR and save It in cache', async () => {
    const cache = new NodeCache();
    const response = /** @type {Insurance.Response} */ ({
      data: {
        token: TOKEN
      }
    });
    const xhrFake = {
      invoke(method, path, headers, payload) {
        assert.strictEqual(method, Methods.POST);
        assert.strictEqual(path, `${INSURANCE_API_URL}/login`);
        assert.strictEqual(headers, null);
        assert.deepStrictEqual(payload, LOGIN_CREDENTIAL);
        return response;
      }
    };

    try {
      const API = new ApiClientService(cache, xhrFake);
      assert.strictEqual(await API.login(), TOKEN);
      assert.strictEqual(cache.get('token'), TOKEN);
    } catch (error) {
      assert.fail(error);
    }
  });

  it('should load a list of clients from XHR and save in cache', async () => {
    const cache = new NodeCache();
    cache.set('token', '1234');
    const xhrFake = {
      invoke(method, path) {
        assert.strictEqual(method, Methods.GET);
        assert.strictEqual(path, `${INSURANCE_API_URL}/clients`);
        return {
          status: 200,
          data: {
            clients: clients.body
          },
          headers: clients.headers
        };
      }
    };

    try {
      const API = new ApiClientService(cache, xhrFake);
      const clientsFromApi = (await API.loadClients()).clients;
      assert.deepStrictEqual(clientsFromApi, clients.body);
      assert.deepStrictEqual(cache.get('/clients').json.clients, clients.body);
    } catch (error) {
      assert.fail(error);
    }
  });

  it('should load a list of policies from XHR and save in cache', async () => {
    const cache = new NodeCache();
    cache.set('token', '1234');
    const xhrFake = {
      invoke(method, path) {
        assert.strictEqual(method, Methods.GET);
        assert.strictEqual(path, `${INSURANCE_API_URL}/policies`);
        return {
          status: 200,
          data: {
            policies: policies.body
          },
          headers: policies.headers
        };
      }
    };

    try {
      const API = new ApiClientService(cache, xhrFake);
      const policiesFromApi = (await API.loadPolicies()).policies;
      assert.deepStrictEqual(policiesFromApi, policies.body);
      assert.deepStrictEqual(cache.get('/policies').json.policies, policies.body);
    } catch (error) {
      assert.fail(error);
    }
  });
});
