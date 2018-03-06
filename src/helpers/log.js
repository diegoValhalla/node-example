const bunyan = require('bunyan');
const config = require('../config');

const log = bunyan.createLogger({
  name: 'example',
  level: config.get('NODE_ENV') !== 'test' ? 'info' : 'fatal',
  serializers: {
    req: req => ({
      method: req.method,
      url: req.url,
      hostname: req.hostname,
    }),
    res: res => ({
      statusCode: res.statusCode,
    }),
  },
});

module.exports = log;
