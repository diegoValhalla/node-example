const { dbAdmin } = require('./db');
const helpers = require('./helpers');

class FirebaseAdapter {
  static verifyToken({ token }) {
    return dbAdmin
      .auth()
      .verifyIdToken(token)
      .then(data => Promise.resolve({ email: data.email }))
      .catch(err => Promise.reject(err));
  }

  static getUsers() {
    return dbAdmin
      .auth()
      .listUsers()
      .then((list) => {
        const users = (typeof list === 'object' && list.users) || [];
        const mappedUsers = users.map(user =>
          helpers.mapFirebaseToAccounts(user));

        return Promise.resolve(mappedUsers);
      })
      .catch(err => Promise.reject(err));
  }

  static getUser({ userId }) {
    return dbAdmin
      .auth()
      .getUser(userId)
      .then((user) => {
        const mappedUser = helpers.mapFirebaseToAccounts(user);
        return Promise.resolve(mappedUser);
      })
      .catch(err => Promise.reject(err));
  }

  static addUser({ email, password }) {
    return dbAdmin
      .auth()
      .createUser({
        emailVerified: true,
        email,
        password,
      })
      .then((user) => {
        const mappedUser = helpers.mapFirebaseToAccounts(user);
        return Promise.resolve(mappedUser);
      })
      .catch(err => Promise.reject(err));
  }

  static updateUser({ userId, data }) {
    return dbAdmin
      .auth()
      .updateUser(userId, data)
      .then((user) => {
        const mappedUser = helpers.mapFirebaseToAccounts(user);
        return Promise.resolve(mappedUser);
      })
      .catch(err => Promise.reject(err));
  }

  static removeUser({ userId }) {
    return dbAdmin
      .auth()
      .deleteUser(userId)
      .then(() => Promise.resolve())
      .catch(err => Promise.reject(err));
  }
}

module.exports = FirebaseAdapter;
