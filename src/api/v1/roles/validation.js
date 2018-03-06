const Joi = require('joi');
const validationObject = require('../../../helpers/validation-objects');

module.exports = validationObject({
  add: {
    body: Joi.object().keys({
      tag: Joi.string().required(),
    }).unknown(false),
  },
  getById: {
    params: {
      id: Joi.string().required(),
    },
  },
});
