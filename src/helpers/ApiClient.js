const { INSURANCE_API_URL } = process.env;
const CLIENT_ID = process.env.INSURANCE_API_CLIENT_ID;
const CLIENT_SECRET = process.env.INSURANCE_API_CLIENT_SECRET;
const _headers = {
  accept: 'application/json',
  'accept-language': 'en-US,en;q=0.9',
  'content-type': 'application/json',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-origin',
};

module.exports = class ApiClient {
  /**
   * @param {Map} cache
   * @param {xhr} xhr
   */
  static async login(cache, xhr) {
    const res = await xhr.invoke('POST', `${INSURANCE_API_URL}/login`, _headers,
      `{
        "client_id": "${CLIENT_ID}",
        "client_secret": "${CLIENT_SECRET}"
      }`);

    const { token } = res.json;
    if (token) {
      cache.set('token', token);
      return token;
    }
    return null;
  }

  /**
   * @param {Map} cache
   * @param {XhrWrapper} xhr
   */
  static async loadData(path, cache, xhr) {
    const headers = { ..._headers };
    const cached = cache.get(path);
    if (cached) {
      headers['If-None-Match'] = cached.etag;
    }

    let retry = true;
    if (!cache.get('token')) {
      await ApiClient.login(cache, xhr);
      retry = false;
    }

    headers.authorization = `Bearer ${cache.get('token')}`;
    let res = await xhr.invoke('GET', process.env.INSURANCE_API_URL + path, headers);

    if (retry && res.status === 401) {
      res = xhr.invoke('GET', path, headers);
    }

    if (res.status === 200) {
      const { json, etag } = res;
      cache.set(path, {
        json,
        etag
      });
      return json;
    }
    if (res.status === 304) {
      return cached.json;
    }
    return null;
  }
};
