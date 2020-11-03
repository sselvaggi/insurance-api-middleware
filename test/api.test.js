const request = require('supertest');
const { expect } = require('chai');

const app = require('../src/app');

describe('POST /api/v1/login', async () => {
  it('responds with a json message', (done) => {
    request(app)
      .post('/api/v1/login')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        expect(response.body.type, 'Bearer');
        expect(response.body.token.length > 1, true);
        done()
      }).catch((error) => {
        done(error)
      })
  });
});
