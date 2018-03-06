const express = require('express');
const validation = require('./validation');
const db = require('../../../db');

const router = express.Router();

/**
 * @api {get} /users Get all users
 * @apiVersion 1.0.0
 * @apiName GetUsers
 * @apiGroup User
 * @apiSuccessExample {json} Success (example):
 *   [ user1, user2, ..., usern ]
 */
router.get('/', (req, res) => {
  db.User
    .getUsers()
    .then((users) => {
      res.set('X-Total-Count', users.length);
      res.status(200).json(users);
    })
    .catch(err => res.status(400).json({
      message: (typeof err === 'object' && err.message) || 'error',
    }));
});

/**
 * @api {post} /users Add user
 * @apiVersion 1.0.0
 * @apiName AddUser
 * @apiGroup User
 * @apiParam (Body) {String} email user email.
 * @apiParam (Body) {Number} roleId role id to set the user.
 * @apiUse UserNotFound
 * @apiSuccessExample {json} Success (example):
 *   { "message": "ok" }
 */
router.post('/', validation.add, (req, res) => {
  db.User
    .addUser({ userData: req.body })
    .then(() => res.status(200).json({ message: 'ok' }))
    .catch(err => res.status(400).json({
      message: (typeof err === 'object' && err.message) || 'error',
    }));
});

/**
 * @api {get} /users/:id Get user by id
 * @apiVersion 1.0.0
 * @apiName GetUser
 * @apiGroup User
 * @apiParam {String} id User unique ID.
 * @apiUse UserNotFound
 * @apiSuccessExample {json} Success (example):
 *  {
 *    "id": "1",
 *    "email": "test@test.com",
 *    "roleId": 1,
 *    "createdAt": "2018-03-01T14:51:28.790Z",
 *    "updatedAt": "2018-03-01T14:51:28.790Z",
 *    "role": {} // check role object,
 *  }
 */
router.get('/:id', validation.getById, (req, res) => {
  const { id: userId } = req.params;

  db.User
    .getUser({ userId })
    .then(user => res.status(200).json(user))
    .catch(err => res.status(404).json({
      error: (typeof err === 'object' && err.message) || 'error',
    }));
});

/**
 * @api {put} /users/:id Update user data by id
 * @apiVersion 1.0.0
 * @apiName UpdateUser
 * @apiGroup User
 * @apiParam {Number} roleId User's role id.
 * @apiUse UserNotFound
 * @apiSuccessExample {json} Success (example):
 *  { user }
 */
router.put('/:id', validation.update, (req, res) => {
  const { id: userId } = req.params;
  const data = Object.assign({}, req.body);

  db.User
    .updateUser({ userId, data })
    .then(user => res.status(200).json(user))
    .catch(err => res.status(400).json({
      message: (typeof err === 'object' && err.message) || 'error',
    }));
});

/**
 * @api {delete} /users/:id Delete user by id
 * @apiVersion 1.0.0
 * @apiName DeleteUser
 * @apiGroup User
 * @apiParam {String} id User unique ID.
 * @apiUse UserNotFound
 * @apiSuccessExample {json} Success (example):
 *   { "message": "ok" }
 */
router.delete('/:id', validation.getById, (req, res) => {
  const { id: userId } = req.params;

  db.User
    .removeUser({ userId })
    .then(() => res.status(200).json({ message: 'ok' }))
    .catch(err => res.status(404).json({
      message: (typeof err === 'object' && err.message) || 'error',
    }));
});

module.exports = router;
