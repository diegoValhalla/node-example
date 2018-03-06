/**
 * Even though error handler is a middleware, it MUST be used after all API
 * definitions, because if any error happens, it is thrown as next(err)
 * middleware in the stack. Since 'err' is not null, this handler is called.
 *
 * When an error different of 400 (bad request) is catched, its stacked is
 * logged and a 500 response is sent.
 *
 * Note: expressjs catches all errors that happen inside its routes and handle
 * it in the 'error-handler' middleware. However, if an error outsite expressjs
 * happens, such as when mongodb failed to authenticate, this error will only
 * be caught when using 'process.on('uncaughtException', function(err) {})'.
 *
 * @return {function} middleware to handle errors in Express
 */

const eValidation = require('express-validation');
const log = require('../../helpers/log');

module.exports = () => (err, req, res, next) => { // eslint-disable-line
  if (err instanceof eValidation.ValidationError) {
    return res.status(err.status).json(err);
  }

  if (err instanceof Error) {
    log.error(err);
  } else {
    log.error({ err });
  }

  res.status(500).json({ message: 'Internal Server Error' });
};
