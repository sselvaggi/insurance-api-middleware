require('dotenv').config();
const assert = require('assert');
const NodeCache = require('node-cache');
const sinon = require('sinon');
const FAKE_SERVER = require('../fixtures/server');
const XHR = require('../../src/helpers/XHR');
const helper = require('../../src/helpers/ApiClient');
const xhr = require('../../src/helpers/XHR');
const clients = require('../fixtures/clients');

describe('helpers/insuranceApiClient', () => {
  // eslint-disable-next-line no-undef
  before(() => {
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
  describe('get clients', () => {
    it('should retrieve a list of clients', async () => {
      const cache = new NodeCache();
      try {
        const result = await helper.loadData('/clients', cache, xhr);
        assert.deepStrictEqual(result, clients.body);
      } catch (error) {
        assert.fail(error);
      }
    });
  });
});
