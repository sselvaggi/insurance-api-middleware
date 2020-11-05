const policies = require('./policies');

module.exports = {
  'https://dare-nodejs-assessment.herokuapp.com/api/clients': {
    json: policies.body,
    etag: policies.headers.etag,
    status: 200
  },
  'https://dare-nodejs-assessment.herokuapp.com/api/login': {
    json: {
      type: 'Bearer',
      token: '1234'
    },
    etag: null,
    status: 200
  }
};
