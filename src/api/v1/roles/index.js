const express = require('express');
const validation = require('./validation');
const db = require('../../../db');

const router = express.Router();

/**
 * @api {get} /roles Get all roles
 * @apiVersion 1.0.0
 * @apiName GetRoles
 * @apiGroup Role
 * @apiSuccessExample {json} Success (example):
 *   [ role1, role2, ..., rolen ]
 */
router.get('/', (req, res) => {
  db.Role
    .getRoles()
    .then(roles => res.status(200).json(roles))
    .catch(err => res.status(400).json({ message: err.message }));
});

/**
 * @api {post} /roles Add role
 * @apiVersion 1.0.0
 * @apiName AddRole
 * @apiGroup Role
 * @apiParam (Body) {String} tag role tag.
 * @apiSuccessExample {json} Success (example):
 *   { "message": "ok" }
 */
router.post('/', validation.add, (req, res) => {
  const { tag } = req.body;

  db.Role
    .addRole({ roleTag: tag })
    .then(role => res.status(200).json(role))
    .catch(err => res.status(400).json({ message: err.message }));
});

/**
 * @api {get} /roles/:id Get role by id
 * @apiVersion 1.0.0
 * @apiName GetRole
 * @apiGroup Role
 * @apiParam {String} id role unique ID.
 * @apiUse RoleNotFound
 * @apiSuccessExample {json} Success (example):
 *  {
 *    "id": "2",
 *    "tag": "manager",
 *    "createdAt": "2018-03-01T14:51:28.790Z",
 *    "updatedAt": "2018-03-01T14:51:28.790Z",
 *  }
 */
router.get('/:id', validation.getById, (req, res) => {
  const { id: roleId } = req.params;

  db.Role
    .getRole({ roleId })
    .then(role => res.status(200).json(role))
    .catch(err => res.status(404).json({ message: err.message }));
});

/**
 * @api {delete} /roles/:id Delete role by id
 * @apiVersion 1.0.0
 * @apiName DeleteRole
 * @apiGroup Role
 * @apiParam {String} id role unique ID.
 * @apiUse RoleNotFound
 * @apiSuccessExample {json} Success (example):
 *   { "message": "ok" }
 */
router.delete('/:id', validation.getById, (req, res) => {
  const { id: roleId } = req.params;

  db.Role
    .removeRole({ roleId })
    .then(() => res.status(200).json({ message: 'ok' }))
    .catch(err => res.status(404).json({ message: err.message }));
});

module.exports = router;
