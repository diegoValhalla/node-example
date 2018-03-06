/* eslint no-shadow: 'off' */

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../index.js');
const { db } = require('../../../db/models');

const { expect } = chai;

chai.use(chaiHttp);

const endpoints = {
  getAll: '/api/v1/roles',
  getById: '/api/v1/roles/:id',
  post: '/api/v1/roles',
  put: '/api/v1/roles/:id',
  delete: '/api/v1/roles/:id',
};

const reqValidBodies = [
  { tag: 'role1' },
  { tag: 'role2' },
];

describe('roles', () => {
  beforeEach((done) => {
    db.sync({ force: true })
      .then(() => done());
  });

  describe(`POST ${endpoints.post}`, () => {
    it('should add a role', (done) => {
      chai.request(server)
        .post(endpoints.post)
        .send(reqValidBodies[0])
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });

    it('should not add a role when the tag has already been inserted', (done) => {
      const req = chai.request(server);
      req
        .post(endpoints.post)
        .send(reqValidBodies[0])
        .end((err, res) => {
          expect(res.status).to.equal(200);
          req
            .post(endpoints.post)
            .send(reqValidBodies[0])
            .end((err, res) => {
              expect(res.status).to.equal(400);
              done();
            });
        });
    });

    it('should not add a role with empty data', (done) => {
      chai.request(server)
        .post(endpoints.post)
        .send({})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
    });

    it('should not add a role with invalid tag', (done) => {
      chai.request(server)
        .post(endpoints.post)
        .send({ tag: 1 })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
    });

    it('should not add a role with not allowed properties', (done) => {
      chai.request(server)
        .post(endpoints.post)
        .send({ tag: 1, notAllowProperty: '' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
    });
  });

  describe(`PUT ${endpoints.put}`, () => {
    it('should not have a PUT method', (done) => {
      chai.request(server)
        .put(endpoints.put.replace(':id', 1))
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
    });
  });

  describe(`GET ${endpoints.getById}`, () => {
    it('should not get role with invalid id', (done) => {
      chai.request(server)
        .get(endpoints.getById.replace(':id', 1))
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
    });

    it('should get role by id', (done) => {
      const req = chai.request(server);
      req
        .post(endpoints.post)
        .send(reqValidBodies[0])
        .end((err, res) => {
          expect(res.status).to.equal(200);
          req
            .get(endpoints.getById.replace(':id', 1))
            .end((err, res) => {
              expect(res.status).to.equal(200);
              done();
            });
        });
    });
  });

  describe(`GET ${endpoints.getAll}`, () => {
    it('should get an empty list of roles', (done) => {
      chai.request(server)
        .get(endpoints.getAll)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('array').have.lengthOf(0);
          done();
        });
    });

    it('should get all roles', (done) => {
      const req = chai.request(server);
      req
        .post(endpoints.post)
        .send(reqValidBodies[0])
        .end((err, res) => {
          expect(res.status).to.equal(200);
          req
            .post(endpoints.post)
            .send(reqValidBodies[1])
            .end((err, res) => {
              expect(res.status).to.equal(200);
              req
                .get(endpoints.getAll)
                .end((err, res) => {
                  expect(res.status).to.equal(200);
                  expect(res.body).to.be.an('array').have.lengthOf(2);
                  done();
                });
            });
        });
    });
  });

  describe(`DELETE ${endpoints.delete}`, () => {
    it('should give ok when removing role by invalid id', (done) => {
      chai.request(server)
        .delete(endpoints.delete.replace(':id', 1))
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });

    it('should remove role by id', (done) => {
      const req = chai.request(server);
      req
        .post(endpoints.post)
        .send(reqValidBodies[0])
        .end((err, res) => {
          expect(res.status).to.equal(200);
          req
            .delete(endpoints.delete.replace(':id', 1))
            .end((err, res) => {
              expect(res.status).to.equal(200);
              req
                .get(endpoints.getById.replace(':id', 1))
                .end((err, res) => {
                  expect(res.status).to.equal(404);
                  done();
                });
            });
        });
    });
  });
});
