const Joi = require('joi');
const validationObject = require('../../../helpers/validation-objects');

module.exports = validationObject({
  add: {
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      roleId: Joi.number(),
    }).unknown(false),
  },
  getById: {
    params: {
      id: Joi.string().required(),
    },
  },
  update: {
    params: {
      id: Joi.string().required(),
    },
    body: Joi.object().keys({
      roleId: Joi.number().required(),
    }).unknown(false),
  },
});
