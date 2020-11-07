const fetch = require('node-fetch');
const assert = require('assert');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const app = require('../../src/app');
const XHR = require('../../src/helpers/XHR');
const FAKE_SERVER = require('../fixtures/server');
const login = require('../helpers/login');
const clients = require('../fixtures/clients');

const PORT = process.env.PORT || 3000;
const CLIENT_ID = clients.body[1].id;

const BASE_URL = `http://localhost:${PORT}`;

describe('POST /api/v1/login', () => {
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
      (method, url) => FAKE_SERVER[url]
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
        assert.deepStrictEqual(data, 'public-api');
      });
    } catch (error) {
      assert.fail(error);
    }
  });

  it('responds with a list of clients', async () => {
    try {
      const token = await login(BASE_URL);
      const response = await (await fetch(`${BASE_URL}/api/v1/clients?limit=10`, {
        method: 'get',
        headers: {
          authorization: `Bearer ${token}`
        }
      })).json();
      assert.deepStrictEqual(response.clients.length, 10);
      assert.deepStrictEqual(response.clients, clients.body.slice(0, 10));
    } catch (error) {
      assert.fail(error);
    }
  });

  it('responds with a list of clients named Johns', async () => {
    try {
      const token = await login(BASE_URL);
      const response = await (await fetch(`${BASE_URL}/api/v1/clients?name=Johns`, {
        method: 'get',
        headers: {
          authorization: `Bearer ${token}`
        }
      })).json();
      assert.deepStrictEqual(response.clients[0].name, 'Johns');
    } catch (error) {
      assert.fail(error);
    }
  });

  it('responds with a client', async () => {
    try {
      const token = await login(BASE_URL);
      const response = await (await fetch(`${BASE_URL}/api/v1/clients/${CLIENT_ID}`, {
        method: 'get',
        headers: {
          authorization: `Bearer ${token}`
        }
      })).json();
      assert.deepStrictEqual(response.client, clients.body[1]);
    } catch (error) {
      assert.fail(error);
    }
  });
});
