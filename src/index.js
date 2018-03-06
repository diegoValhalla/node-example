const express = require('express');
const helmet = require('helmet');
const middlewares = require('./middlewares');
const api = require('./api');

const SERVER_PORT = process.env.PORT || 3001;

const setupServer = () => {
  const app = express();

  // configure server
  app.use(middlewares.logReqResp());
  app.use(helmet());
  app.use(express.json());

  // set endpoints
  Object
    .keys(api)
    .forEach(uri => app.use(uri, api[uri]));

  app.use(middlewares.errorHandler());

  return app;
};

const server = setupServer();

server.listen(SERVER_PORT, (error) => { // eslint-disable-line
  if (error) {
    return console.error(error);
  }
  console.log('Webserver started at', SERVER_PORT);
});

module.exports = server;
