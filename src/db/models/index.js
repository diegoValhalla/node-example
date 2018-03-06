const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('../../config');

const sequelize = new Sequelize(
  config.get('db:database'),
  config.get('db:username'),
  config.get('db:password'),
  {
    host: config.get('db:host'),
    dialect: config.get('db:dialect'),
    storage: config.get('db:storage'),
    logging: config.get('db:logging'),
  },
);

const modelInstances = fs
  .readdirSync(__dirname)
  .reduce((models, fileName) => {
    if (fileName === 'index.js') {
      return models;
    }

    const fileBaseName = path.basename(fileName, '.js');
    const filePath = path.join(__dirname, fileBaseName);
    const model = sequelize.import(filePath);

    return { ...models, [fileBaseName]: model };
  }, { db: sequelize });

// set model associations
Object.keys(modelInstances).forEach((modelName) => {
  if (modelInstances[modelName].associate) {
    modelInstances[modelName].associate(modelInstances);
  }
});

module.exports = modelInstances;
