const fetch = require('node-fetch');

module.exports = async (BASE_URL) => {
  try {
    const json = await (await fetch(`${BASE_URL}/api/v1/login`, {
      method: 'post',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        accept: 'application/json',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/json',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
      },
      body: JSON.stringify({
        client_id: process.env.PUBLIC_API_ID,
        client_secret: process.env.PUBLIC_API_SECRET
      })
    })).json();
    return json.token;
  } catch (error) {
    console.log(error);
  }
};
