const { Role } = require('../models');
const log = require('../../helpers/log');

async function getRoles() {
  return Role.findAll();
}

async function getRole({ roleId }) {
  const role = await Role.findOne({ where: { id: roleId } });

  if (!role) {
    throw new Error('Invalid id');
  }

  return role;
}

async function addRole({ roleTag }) {
  let role = {};

  try {
    role = await Role.create({ tag: roleTag });
  } catch (err) {
    log.error(err);
    throw new Error('Unable to add role');
  }

  return role;
}

async function updateRole({ roleId, data }) {
  await Role.update(data, { where: { id: roleId } });
  return getRole({ roleId });
}

async function removeRole({ roleId }) {
  return Role.destroy({ where: { id: roleId } });
}

module.exports = {
  getRoles,
  getRole,
  addRole,
  updateRole,
  removeRole,
};
