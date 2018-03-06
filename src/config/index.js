const fs = require('fs');
const path = require('path');
const nconf = require('nconf');

nconf.use('memory');
nconf.env(['NODE_ENV']);

const NODE_ENV = nconf.get('NODE_ENV');

// load config data of each directory and set its content in nconf using the
// directory name as the key.
// Note: some configuration files may use the environment name, e.g. dev, to
// set diferent data.
fs
  .readdirSync(__dirname)
  .forEach((dirName) => {
    if (dirName === 'index.js') {
      return;
    }
    const dirPath = path.join(__dirname, dirName);
    const dirData = require(dirPath); // eslint-disable-line
    nconf.set(dirName, (dirData[NODE_ENV]) ? dirData[NODE_ENV] : dirData);
  });

module.exports = nconf;
