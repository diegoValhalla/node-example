/**
 * Middleware to validate request parameters, query, and body. It uses 'Joi'
 * module to validate the data and emit an ApiError if something doesn't match.
 */

const Joi = require('joi');
const ApiError = require('../../helpers/ApiError');
const reqSender = require('../../helpers/reqSender');

const requestProperties = ['params', 'query', 'body'];
const joiDefaultOptions = {
  presence: 'required',
  stripUnknown: true,
  abortEarly: false,
};

/**
 * Map Joi error data to custom error definition.
 * @param {object} joiDetail - Joi error details.
 * @param {string} joiDetail - Joi error details.
 */
const mapJoiErrors = (joiDetail, location) => ({
  location,
  path: joiDetail.path,
  message: joiDetail.message,
});

/**
 * Runs Joi validation and return a Promise that always resolve, because Joi
 * does not return a Promise, then to have each validation (params, query,
 * body) running synchronously and aggregate the errors, this method always
 * resolve a promise.
 * @param {object} req - request object.
 * @param {string} location - params, query, or body.
 * @param {object} data - request params, query, or body.
 * @param {object} schema - schema to validate data.
 * @returns {Promise} A promise that always resolve.
 */
const validate = (req, location, data, schema) => (
  new Promise(resolve => (
    Joi.validate(data, schema, joiDefaultOptions, (joiError, value) => {
      // update data with Joi value that was converted/modifier, e.g. trim string
      if (!joiError) {
        req[location] = { ...data, ...value };
        return resolve(null);
      }

      const errors = joiError.details.reduce((mappedErrors, joiDetail) => {
        const errorAlreadyAdded = mappedErrors.find(mapped =>
          mapped.field === joiDetail.path);

        if (errorAlreadyAdded) {
          errorAlreadyAdded.messages.push(joiDetail.message);
          errorAlreadyAdded.types.push(joiDetail.type);
        } else {
          const mappedError = mapJoiErrors(joiDetail, location);
          mappedErrors.push(mappedError);
        }

        return mappedErrors;
      }, []);

      return resolve(errors);
    })
  ))
);

/**
 * Validates each request property to the given schema.
 * @param {object} schema - schema to validate request.
 * @returns {function} middleware.
 */
const reqValidator = schema => (req, res, next) => {
  const promiseList = [];

  requestProperties.forEach((propName) => {
    if (!Object.prototype.hasOwnProperty.call(schema, propName)) {
      return;
    }

    const promise = validate(req, propName, req[propName], schema[propName]);

    promiseList.push(promise);
  });

  Promise.all(promiseList).then((errors) => {
    // since each request property, e.g. params and query, may have more than
    // one errors, each value of errors could be a list of errors. Then, they
    // are concatenate in the same list.
    const errorList = [].concat(...errors).filter(error => error !== null);

    if (errorList.length > 0) {
      const apiError = new ApiError(400, 'Bad Request', errorList);
      return reqSender(apiError, res);
    }

    return next();
  });
};

module.exports = reqValidator;
