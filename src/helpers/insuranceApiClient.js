const fetch = require('node-fetch')
const INSURANCE_API_URL = process.env.INSURANCE_API_URL;
const CLIENT_ID = process.env.INSURANCE_API_CLIENT_ID;
const CLIENT_SECRET = process.env.INSURANCE_API_CLIENT_SECRET;

module.exports.login = async () => {
    const res = await fetch(`${INSURANCE_API_URL}/login`, {
        headers: {
            accept: 'application/json',
            'accept-language': 'en-US,en;q=0.9',
            'content-type': 'application/json',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'cookie': 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6ImRhcmUiLCJpYXQiOjE2MDQzMzI0NjksImV4cCI6MTYwNDMzMzA2OX0.JcZk0Mrj0uB0DT6ZPzQdFNiP-wOvJV_T_grdY94s5BM'
        },
        'referrer': 'https://dare-nodejs-assessment.herokuapp.com/swagger/static/index.html',
        'referrerPolicy': 'strict-origin-when-cross-origin',
        'body': `{\n  \"client_id\": \"${CLIENT_ID}\",\n  \"client_secret\": \"${CLIENT_SECRET}\"\n}`,
        'method': 'POST',
        'mode': 'cors'
      });
    const json = await res.json();
    return json;
}