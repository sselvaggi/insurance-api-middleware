/// <reference path="../../index.d.ts" />
const axios = require('axios');
const assert = require('assert');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const { Methods } = require('http-headers-js');
const app = require('../../src/app');
const XHR = require('../../src/helpers/XHR');
const FAKE_SERVER = require('../fixtures/server');
const login = require('../helpers/login');
const clients = require('../fixtures/clients');
const policies = require('../fixtures/policies');

const PORT = process.env.PORT || 3000;
const CLIENT_ID = clients.body[1].id;

const BASE_URL = `http://localhost:${PORT}`;
const REST_METHODS = [Methods.GET, Methods.POST, Methods.PUT, Methods.DELETE];

describe('API Test', () => {
  // eslint-disable-next-line no-undef
  before(async () => {
    app.listen(PORT, () => {});
    sinon.stub(XHR, 'invoke').callsFake(
      /**
       * @param {String} method
       * @param {String} url
       * @param {*} headers
       * @param {*} body
       */
      (method, url) => {
        if (!REST_METHODS.indexOf(method) === -1) throw new Error('Invalid http method', method);
        return FAKE_SERVER[url];
      }
    );
  });

  // eslint-disable-next-line no-undef
  after(() => {
    sinon.restore();
  });

  it('responds with a json token', async () => {
    try {
      const token = await login(BASE_URL);
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, data) => {
        if (error) assert.fail(error);
        assert.deepStrictEqual(data.user, 'public-api');
      });
    } catch (error) {
      assert.fail(error);
    }
  });

  it('responds with a list of 10 clients', async () => {
    try {
      const token = await login(BASE_URL);
      const response = /** @type {Insurance.ClientListResponse} */ (await axios({
        url: `${BASE_URL}/api/v1/clients`,
        method: Methods.GET,
        headers: {
          authorization: `Bearer ${token}`
        }
      }));
      assert.deepStrictEqual(response.data.clients.length, 10);
      assert.deepStrictEqual(response.data.clients, clients.body.slice(0, 10));
    } catch (error) {
      assert.fail(error);
    }
  });

  it('responds with a list of 50 clients page 1', async () => {
    try {
      const token = await login(BASE_URL);
      const response = /** @type {Insurance.ClientListResponse} */ (await axios({
        url: `${BASE_URL}/api/v1/clients?limit=50`,
        method: Methods.GET,
        headers: {
          authorization: `Bearer ${token}`
        }
      }));
      assert.deepStrictEqual(response.data.clients.length, 50);
      assert.deepStrictEqual(response.data.clients, clients.body.slice(0, 50));
    } catch (error) {
      assert.fail(error);
    }
  });

  it('responds with a list of 50 clients page 2', async () => {
    try {
      const token = await login(BASE_URL);
      const response = /** @type {Insurance.ClientListResponse} */ (await axios({
        url: `${BASE_URL}/api/v1/clients?limit=50&page=2`,
        method: Methods.GET,
        headers: {
          authorization: `Bearer ${token}`
        }
      }));
      assert.deepStrictEqual(response.data.clients.length, 50);
      assert.deepStrictEqual(response.data.clients, clients.body.slice(50, 100));
    } catch (error) {
      assert.fail(error);
    }
  });

  it('responds with a list of clients named Johns', async () => {
    try {
      const token = await login(BASE_URL);
      const response = /** @type {Insurance.ClientListResponse} */ (await axios({
        url: `${BASE_URL}/api/v1/clients?name=Johns`,
        method: Methods.GET,
        headers: {
          authorization: `Bearer ${token}`
        }
      }));
      assert.deepStrictEqual(response.data.clients[0].name, 'Johns');
    } catch (error) {
      assert.fail(error);
    }
  });

  it('responds with a client', async () => {
    try {
      const token = await login(BASE_URL);
      const response = /** @type {Insurance.ClientResponse} */ (await axios({
        url: `${BASE_URL}/api/v1/clients/${CLIENT_ID}`,
        method: Methods.GET,
        headers: {
          authorization: `Bearer ${token}`
        }
      }));
      assert.deepStrictEqual(response.data.client, clients.body[1]);
    } catch (error) {
      assert.fail(error);
    }
  });

  it('responds with a list of 10 policies', async () => {
    try {
      const token = await login(BASE_URL);
      const response = /** @type {Insurance.PolicyListResponse} */ (await axios({
        url: `${BASE_URL}/api/v1/policies`,
        method: Methods.GET,
        headers: {
          authorization: `Bearer ${token}`
        }
      }));
      assert.deepStrictEqual(response.data.policies.length, 10);
      assert.deepStrictEqual(response.data.policies, policies.body.slice(0, 10));
    } catch (error) {
      assert.fail(error);
    }
  });

  it('responds with a list of 50 policies page 1', async () => {
    try {
      const token = await login(BASE_URL);
      const response = /** @type {Insurance.PolicyListResponse} */ (await axios({
        url: `${BASE_URL}/api/v1/policies?limit=50`,
        method: Methods.GET,
        headers: {
          authorization: `Bearer ${token}`
        }
      }));
      assert.deepStrictEqual(response.data.policies.length, 50);
      assert.deepStrictEqual(response.data.policies, policies.body.slice(0, 50));
    } catch (error) {
      assert.fail(error);
    }
  });

  it('responds with a list of 50 policies page 2', async () => {
    try {
      const token = await login(BASE_URL);
      const response = /** @type {Insurance.PolicyListResponse} */ (await axios({
        url: `${BASE_URL}/api/v1/policies?limit=50&page=2`,
        method: Methods.GET,
        headers: {
          authorization: `Bearer ${token}`
        }
      }));
      assert.deepStrictEqual(response.data.policies.length, 50);
      assert.deepStrictEqual(response.data.policies, policies.body.slice(50, 100));
    } catch (error) {
      assert.fail(error);
    }
  });
});
