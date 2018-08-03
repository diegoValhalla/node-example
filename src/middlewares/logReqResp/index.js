const uuid = require('uuid/v1');
const log = require('../../helpers/log');

/**
 * Middleware to log every time a request is made to the server and its
 * response.
 * @returns {function} middleware.
 */
module.exports = () => (req, res, next) => {
  const reqId = uuid();

  req.log = log.child({ reqId });
  req.log.info({ req });

  res.on('finish', () => {
    if (res.statusCode === 200) {
      req.log.info({ res });
    } else if (res.statusCode >= 400 && res.statusCode < 500) {
      req.log.warn({ res });
    } else if (res.statusCode === 500) {
      req.log.error({ res });
    } else {
      req.log.debug({ res });
    }
  });

  next();
};
