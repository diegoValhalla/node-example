const fs = require('fs');
const path = require('path');

/**
 * Export all files as an object: { <filename>: <file module.exports> }
 */
const getAllExports = () => {
  const middlewares = fs
    .readdirSync(__dirname)
    .reduce((obj, folderName) => {
      if (folderName === 'index.js') {
        return obj;
      }

      const mididlewarePath = path.join(__dirname, folderName);
      obj[folderName] = require(mididlewarePath); // eslint-disable-line

      return obj;
    }, {});

  return middlewares;
};

module.exports = getAllExports();
