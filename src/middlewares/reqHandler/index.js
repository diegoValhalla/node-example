const log = require('../../helpers/log');
const reqSender = require('../../helpers/reqSender');

/**
 * Default endpoint handler middleware to avoid duplicated code when getting
 * parameters from request and sending a response.
 * @param {function} handler - function to handle request.
 * @param {function} getParamsFn - function to select request parameters.
 * @returns {function} middleware.
 */
const reqHandler = (handler, getParamsFn) => async (req, res) => {
  let error = null;
  let result = {};

  try {
    let params = (typeof getParamsFn === 'function') ? getParamsFn(req) : [];

    if (!Array.isArray()) {
      params = [params];
    }

    // add response object as last parameter, so headers could be added if
    // needded.
    params.push(res);

    result = await handler(...params);
  } catch (err) {
    error = err;
    log.error(error);
  }

  reqSender(error, res, result);
};

module.exports = reqHandler;
