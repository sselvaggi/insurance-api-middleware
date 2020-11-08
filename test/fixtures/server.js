const clients = require('./clients');
const policies = require('./policies');

module.exports = {
  'https://dare-nodejs-assessment.herokuapp.com/api/clients': {
    data: clients.body,
    headers: clients.headers,
    status: 200
  },
  'https://dare-nodejs-assessment.herokuapp.com/api/policies': {
    data: policies.body,
    headers: policies.headers,
    status: 200
  },
  'https://dare-nodejs-assessment.herokuapp.com/api/login': {
    data: {
      type: 'Bearer',
      token: '1234'
    },
    headers: {
      etag: null
    },
    status: 200
  }
};
