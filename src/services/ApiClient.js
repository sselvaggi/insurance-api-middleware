/// <reference path="../../index.d.ts" />
/**
 * @typedef {import('../helpers/XHR')} XHR
 */
const {
  Headers,
  Methods,
  ResponseCodes,
} = require('http-headers-js');

const {
  INSURANCE_API_CLIENT_ID,
  INSURANCE_API_CLIENT_SECRET,
  INSURANCE_API_URL
} = process.env;

const LOGIN_CREDENTIAL = /** @type {Insurance.Credential} */ ({
  client_id: INSURANCE_API_CLIENT_ID,
  client_secret: INSURANCE_API_CLIENT_SECRET
});

module.exports = class ApiClient {
  /**
   * @param {Map} cache
   * @param {XHR} xhr
   */
  constructor(cache, xhr) {
    this.cache = cache;
    this.xhr = xhr;
  }

  async login() {
    const res = await this.xhr.invoke(Methods.POST, `${INSURANCE_API_URL}/login`, null, LOGIN_CREDENTIAL);
    const { token } = res.data;
    if (token) {
      this.cache.set('token', token);
      return token;
    }
    return null;
  }

  /**
   * @returns {Insurance.Client[]}
   */
  async loadClients() {
    return this.loadData('/clients');
  }

  /**
   * @returns {Insurance.Client}
   */
  async loadClientsByEmail(email) {
    const clients = await this.loadClients();
    return clients.find((client) => client.email === email);
  }

  /**
   * @returns {Insurance.Client}
   */
  async loadClientById(id) {
    return (await this.loadClients())
      .find((client) => client.id === id);
  }

  /**
   * @returns {Insurance.Policy[]}
   */
  async loadPolicies() {
    return this.loadData('/policies');
  }

  /**
   * @returns {Insurance.Policy[]}
   */
  async loadPolicieById(id) {
    return (await this.loadData('/policies'))
      .find(/** @param {Insurance.Policy} */ (policy) => policy.id === id);
  }


  /**
   * @returns {Insurance.Policy[]}
   */
  async loadPoliciesByClientId(clientId) {
    const policies = await this.loadData('/policies');
    const policiesByClient = policies
      .filter(/** @param {Insurance.Policy} */ (policy) => policy.clientId === clientId);
    return policiesByClient || [];
  }

  /**
   * @param {String} path
   */
  async loadData(path) {
    try {
      const headers = {};
      const cached = this.cache.get(path);
      if (cached) {
        headers[Headers.IF_NONE_MATCH] = cached.etag;
      }

      let retry = true;
      if (!this.cache.get('token')) {
        await this.login();
        retry = false;
      }

      headers.authorization = `Bearer ${this.cache.get('token')}`;
      let res = await this.xhr.invoke(Methods.GET, process.env.INSURANCE_API_URL + path, headers);

      if (retry && res.status === ResponseCodes.UNAUTHORIZED) {
        res = this.xhr.invoke(Methods.GET, path, headers);
      }

      if (res.status === ResponseCodes.OK) {
        this.cache.set(path, {
          json: res.data,
          etag: res.headers.etag
        });
        return this.cache.get(path).json;
      }

      if (res.status === ResponseCodes.NOT_MODIFIED) {
        return this.cache.get(path).json;
      }
      throw new Error('Unexpected response status', res.status);
    } catch (error) {
      console.log(error);
    }
    return null;
  }
};
