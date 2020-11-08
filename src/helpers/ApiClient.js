/// <reference path="../../index.d.ts" />
/**
 * @typedef {import('./XHR')} XHR
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
  static async login(cache, xhr) {
    const res = await xhr.invoke(Methods.POST, `${INSURANCE_API_URL}/login`, null, LOGIN_CREDENTIAL);
    const { token } = res.data;
    if (token) {
      cache.set('token', token);
      return token;
    }
    return null;
  }

  /**
   * @param {String} path
   * @param {Map} cache
   * @param {XhrWrapper} xhr
   */
  static async loadData(path, cache, xhr) {
    try {
      const headers = {};
      const cached = cache.get(path);
      if (cached) {
        headers[Headers.IF_NONE_MATCH] = cached.etag;
      }

      let retry = true;
      if (!cache.get('token')) {
        await ApiClient.login(cache, xhr);
        retry = false;
      }

      headers.authorization = `Bearer ${cache.get('token')}`;
      let res = await xhr.invoke(Methods.GET, process.env.INSURANCE_API_URL + path, headers);

      if (retry && res.status === ResponseCodes.UNAUTHORIZED) {
        res = xhr.invoke(Methods.GET, path, headers);
      }

      if (res.status === ResponseCodes.OK) {
        cache.set(path, {
          json: res.data,
          etag: res.headers.etag
        });
        return cache.get(path).json;
      }

      if (res.status === ResponseCodes.NOT_MODIFIED) {
        return cache.get(path).json;
      }
      throw new Error('Unexpected response status', res.status);
    } catch (error) {
      console.log(error);
    }
    return null;
  }
};
