const fs = require('fs');
const path = require('path');

const getFiles = () => (
  fs
    .readdirSync(__dirname)
    .reduce((files, fileName) => {
      if (fileName === 'index.js') {
        return files;
      }

      const fileBaseName = path.basename(fileName, '.js');
      const filePath = path.join(__dirname, fileBaseName);
      const fileData = require(filePath); // eslint-disable-line

      return { ...files, [fileBaseName]: fileData };
    }, {})
);

module.exports = getFiles();
