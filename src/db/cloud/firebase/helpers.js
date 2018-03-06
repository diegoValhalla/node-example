const _ = require('lodash');

const FIREBASE_USER_KEYS = {
  uid: 'id',
  email: 'email',
  'metadata.creationTime': 'creationTime',
};

const mapFirebaseToAccounts = (user) => {
  const mappedData = Object
    .keys(FIREBASE_USER_KEYS)
    .reduce((memo, key) => {
      const mappedKey = FIREBASE_USER_KEYS[key];
      let value = _.get(user, key);

      if (mappedKey === 'creationTime') {
        const creationTime = new Date(_.get(user, key));
        value = creationTime.toISOString();
      }

      memo[mappedKey] = value; // eslint-disable-line

      return memo;
    }, {});

  return mappedData;
};

module.exports = {
  mapFirebaseToAccounts,
};
