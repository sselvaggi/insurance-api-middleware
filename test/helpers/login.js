/// <reference path="../../index.d.ts" />
const axios = require('axios');
const { Methods } = require('http-headers-js');
const { DEFAULT_HEADERS } = require('../../src/helpers/XHR');

module.exports = async (BASE_URL) => {
  try {
    const response = await axios({
      url: `${BASE_URL}/api/v1/login`,
      method: Methods.POST,
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: DEFAULT_HEADERS,
      data: JSON.stringify({
        username: process.env.PUBLIC_API_ID,
        password: process.env.PUBLIC_API_SECRET
      })
    });
    return response.data.token;
  } catch (error) {
    return null;
  }
};
