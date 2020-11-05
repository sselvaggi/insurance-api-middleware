const fetch = require('node-fetch');

module.exports = {
  /**
   * @param {String} method
   * @param {String} url
   * @param {*} headers
   * @param {*} body
   *
   * @returns {{json:String, etag:String, status}}
   */
  invoke: async (method, url, headers, body) => {
    const res = await fetch(url, {
      headers,
      referrer: url,
      referrerPolicy: 'strict-origin-when-cross-origin',
      body,
      method,
      mode: 'cors'
    });
    const json = await res.json();
    const etag = res.headers.get('etag');
    return {
      json,
      etag,
      status: res.status
    };
  }
};
