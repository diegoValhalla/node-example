const db = require('../../db');

module.exports = (req, res, next) => { // eslint-disable-line
  const authData = req.headers.authorization || '';
  const token = authData.replace(/Bearer\s+/i, '');

  if (token.length === 0) {
    return res.status(401).json({});
  }

  db.authentication
    .verifyToken(token)
    .then(() => next())
    .catch(err => res.status(401).json(err));
};
