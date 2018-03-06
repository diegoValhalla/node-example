/* eslint no-shadow: 'off' */

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../index.js');

const { expect } = chai;

chai.use(chaiHttp);

const endpoints = { get: '/api/v1/health' };

describe('health', () => {
  describe(`GET ${endpoints.get}`, () => {
    it('should check for a success message', (done) => {
      chai.request(server)
        .get(endpoints.get)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });
  });
});
