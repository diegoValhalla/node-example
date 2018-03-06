const expressValidation = require('express-validation');

module.exports = validationSchemas => Object
  .keys(validationSchemas)
  .reduce((middlewares, schemaName) => {
    const schema = validationSchemas[schemaName];
    const schemaMiddleware = expressValidation(schema);
    return { ...middlewares, [schemaName]: schemaMiddleware };
  }, {});
