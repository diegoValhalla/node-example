const uuid = require('uuid/v1');
const log = require('../../helpers/log');

module.exports = () => (req, res, next) => {
  const reqId = uuid();

  log.info({ reqId, req });

  res.on('finish', () => {
    if (res.statusCode === 200) {
      log.info({ reqId, res });
    } else if (res.statusCode >= 400 && res.statusCode < 500) {
      log.warn({ reqId, res });
    } else if (res.statusCode === 500) {
      log.error({ reqId, res });
    } else {
      log.debug({ reqId, res });
    }
  });

  next();
};
