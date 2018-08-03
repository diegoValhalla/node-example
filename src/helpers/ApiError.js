/**
 * Custom error class to add more information on each API response if needed.
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode
   * @param {string} message
   * @param {object[]} errors
   */
  constructor(statusCode, message, errors) {
    super(message);

    // add 'stack' property to this class and omit its line from the stack
    // since the constructor 'ApiError' is passed.
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.message = message;

    if (errors) {
      this.errors = (Array.isArray(errors)) ? errors : [errors];
    }
  }
}

module.exports = ApiError;
