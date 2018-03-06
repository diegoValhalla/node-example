/* eslint no-shadow: 'off' */

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../index.js');
const { db } = require('../../../db/models');

const { expect } = chai;

chai.use(chaiHttp);

const endpoints = {
  getAll: '/api/v1/users',
  getById: '/api/v1/users/:id',
  post: '/api/v1/users',
  put: '/api/v1/users/:id',
  delete: '/api/v1/users/:id',
  rolesPost: '/api/v1/roles',
};

const reqValidBodies = [
  { email: 'test1@test.com' },
  { email: 'test2@test.com' },
  { email: 'test3@test.com', roleId: 1 },
];

describe('users', () => {
  beforeEach((done) => {
    db.sync({ force: true })
      .then(() => done());
  });

  describe(`POST ${endpoints.post}`, () => {
    it('should add user', (done) => {
      chai.request(server)
        .post(endpoints.post)
        .send(reqValidBodies[0])
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });

    it('should not add user with empty data', (done) => {
      chai.request(server)
        .post(endpoints.post)
        .send({})
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
    });

    it('should not add user with an already used email', (done) => {
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

    it('should not add user with invalid email', (done) => {
      chai.request(server)
        .post(endpoints.post)
        .send({ email: 'qwerty' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
    });

    it('should not add user with not allowed properties', (done) => {
      chai.request(server)
        .post(endpoints.post)
        .send({ ...reqValidBodies[0], notAllowProperty: '' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
    });

    it('should not add user with an invalid role id', (done) => {
      chai.request(server)
        .post(endpoints.post)
        .send({ ...reqValidBodies[0], roleId: 1 })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
    });

    it('should add user with role id', (done) => {
      const req = chai.request(server);
      req
        .post(endpoints.rolesPost)
        .send({ tag: 'role1' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          req
            .post(endpoints.post)
            .send({ ...reqValidBodies[0], roleId: 1 })
            .end((err, res) => {
              expect(res.status).to.equal(200);
              done();
            });
        });
    });
  });

  describe(`PUT ${endpoints.put}`, () => {
    it('should not update user with invalid id', (done) => {
      chai.request(server)
        .put(endpoints.put.replace(':id', 1))
        .send(reqValidBodies[0])
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
    });

    it('should not update user with a non-existent roleId', (done) => {
      const req = chai.request(server);
      req
        .post(endpoints.post)
        .send(reqValidBodies[0])
        .end((err, res) => {
          expect(res.status).to.equal(200);
          req
            .put(endpoints.put.replace(':id', 1))
            .send({ roleId: 1 })
            .end((err, res) => {
              expect(res.status).to.equal(400);
              done();
            });
        });
    });

    it('should update user data', (done) => {
      const req = chai.request(server);
      req
        .post(endpoints.rolesPost)
        .send({ tag: 'role1' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          req
            .post(endpoints.post)
            .send(reqValidBodies[0])
            .end((err, res) => {
              expect(res.status).to.equal(200);
              req
                .put(endpoints.put.replace(':id', 1))
                .send({ roleId: 1 })
                .end((err, res) => {
                  expect(res.status).to.equal(200);
                  done();
                });
            });
        });
    });
  });

  describe(`GET ${endpoints.getById}`, () => {
    it('should not get user with invalid id', (done) => {
      chai.request(server)
        .get(endpoints.getById.replace(':id', 1))
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
    });

    it('should get user by id', (done) => {
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
    it('should get an empty list of users', (done) => {
      chai.request(server)
        .get(endpoints.getAll)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('array').have.lengthOf(0);
          done();
        });
    });

    it('should get all users', (done) => {
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
    it('should give ok when removing user by invalid id', (done) => {
      chai.request(server)
        .delete(endpoints.delete.replace(':id', 1))
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });

    it('should remove user by id', (done) => {
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
