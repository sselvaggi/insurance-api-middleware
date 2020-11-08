/// <reference path="../../index.d.ts" />
const axios = require('axios');
const { ResponseCodes } = require('http-headers-js');
const {
  Headers,
  MimeTypes
} = require('http-headers-js');

const DEFAULT_HEADERS = {
  [Headers.ACCEPT]: MimeTypes.Application.JSON,
  [Headers.ACCEPT_LANGUAGE]: 'en-US,en;q=0.9',
  [Headers.CONTENT_TYPE]: MimeTypes.Application.JSON,
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-origin',
};

/**
 * @param {String} method
 * @param {String} url
 * @param {*} headers
 * @param {*} payload
 *
 * @returns {Insurance.Response}
 */
const invoke = async (method, url, headers, payload) => {
  try {
    return await axios({
      method,
      url,
      headers: { ...DEFAULT_HEADERS, ...headers },
      data: JSON.stringify(payload)
    });
  } catch (error) {
    if (error.response.status === ResponseCodes.NOT_MODIFIED) {
      return error.response;
    }
    return null;
  }
};

module.exports = {
  DEFAULT_HEADERS,
  invoke
};
