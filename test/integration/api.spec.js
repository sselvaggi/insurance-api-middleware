const fetch = require('node-fetch');
const assert = require('assert');
const sinon = require('sinon');
const app = require('../../src/app');
const XHR = require('../../src/helpers/XHR');
const FAKE_SERVER = require('../fixtures/server');
const clients = require('../fixtures/clients');

const PORT = process.env.PORT || 3000;
const CLIENT_ID = clients.body[1].id;

const BASE_URL = `http://localhost:${PORT}`;

describe('POST /api/v1/login', () => {
  // eslint-disable-next-line no-undef
  before(() => {
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
    // app.close();
    sinon.restore();
  });

  it('responds with a json token', async () => {
    try {
      const response = await (await fetch(`${BASE_URL}/api/v1/login`, {
        method: 'post'
      })).json();
      assert.deepStrictEqual(response.token, '1234');
    } catch (error) {
      assert.fail(error);
    }
  });

  it('responds with a list of clients', async () => {
    try {
      const response = await (await fetch(`${BASE_URL}/api/v1/clients?limit=10`, {
        method: 'get'
      })).json();
      assert.deepStrictEqual(response.clients.length, 10);
      assert.deepStrictEqual(response.clients[0], clients.body[0]);
    } catch (error) {
      assert.fail(error);
    }
  });

  it('responds with a client', async () => {
    try {
      const response = await (await fetch(`${BASE_URL}/api/v1/clients/${CLIENT_ID}`, {
        method: 'get'
      })).json();
      assert.deepStrictEqual(response.client, clients.body[1]);
    } catch (error) {
      assert.fail(error);
    }
  });
});
