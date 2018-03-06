const { User, Role } = require('../models');
const log = require('../../helpers/log');

async function getUsers() {
  return User.findAll({
    include: [Role],
    attributes: { exclude: ['roleId'] },
  });
}

async function getUser({ userId }) {
  const user = await User.findOne({
    where: { id: userId },
    include: [Role],
    attributes: { exclude: ['roleId'] },
  });

  if (!user) {
    throw new Error('Invalid id');
  }

  return user;
}

async function addUser({ userData }) {
  try {
    await User.create(userData, { include: [Role] });
  } catch (err) {
    log.error(err);
    throw new Error('Unable to add user');
  }

  return true;
}

async function updateUser({ userId, data }) {
  await User.update(data, { where: { id: userId } });
  return getUser({ userId });
}

async function removeUser({ userId }) {
  return User.destroy({ where: { id: userId } });
}

module.exports = {
  getUsers,
  getUser,
  addUser,
  updateUser,
  removeUser,
};
