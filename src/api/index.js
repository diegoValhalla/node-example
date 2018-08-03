/**
 * Export all files as an object:
 *  { 'api/<version>/<resource>': <resource module.exports> }
 */

const fs = require('fs');
const path = require('path');

const IGNORED_FILES = ['index.js', '_apidoc.js'];

const makeResources = (versionPath, uriNamespace) => fs
  .readdirSync(versionPath)
  .reduce((routes, fileName) => {
    const resourceName = path.basename(fileName, '.js');
    const resourcePath = path.join(versionPath, resourceName);
    const route = require(resourcePath); // eslint-disable-line
    const uri = `${uriNamespace}/${resourceName}`;

    return Object.assign({}, routes, { [uri]: route });
  }, {});

const getApiResources = () => {
  const apiResources = fs
    .readdirSync(__dirname)
    .reduce((resources, versionFolder) => {
      if (IGNORED_FILES.includes(versionFolder)) {
        return resources;
      }

      const versionPath = path.join(__dirname, versionFolder);
      const uriNamespace = `/${path.basename(__dirname)}/${versionFolder}`;
      const versionResources = makeResources(versionPath, uriNamespace);

      return Object.assign({}, resources, versionResources);
    }, {});

  return apiResources;
};

module.exports = getApiResources();
