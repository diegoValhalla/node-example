const log = require('./log');
const ApiError = require('./ApiError');

/**
 * Define a common method to send response of each request in order to avoid
 * duplicated code between each endpoint handler.
 * @param {object} err
 * @param {string} res - server response object
 * @param {*} result - any data to be sent in the response body
 */
const reqSender = (err, res, result) => {
  let code = 200;
  let data = result;

  if (err instanceof ApiError) {
    code = err.statusCode;
    data = { message: err.message, errors: err.errors };
  } else if (err instanceof Error) {
    log.error(err);
    code = 500;
    data = { message: 'Internal Server Error' };
  }

  res.status(code).json(data);
};

module.exports = reqSender;
