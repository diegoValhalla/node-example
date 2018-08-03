/**
 * Template application that could be extended by other services when using it
 * as dependency.
 *
 * As main application, it set a log middleware, parse all requests bodies
 * to json, and define some error handlers. As a dependency, it only doesn't
 * parse the requests bodies to json.
 *
 * This template server also export some main methods to be reused by other
 * services in order to avoid duplicated code when validating requests, sending
 * responses, customizing errors, and so on.
 */

const express = require('express');
const helmet = require('helmet');

const log = require('./helpers/log');
const ApiError = require('./helpers/ApiError');
const middlewares = require('./middlewares');
const api = require('./api');

const SERVER_PORT = process.env.PORT || 3001;
let app;

/**
 * Return an express app with a log middleware being the first one to be
 * executed, and some error handlers by current process. This method is useful
 * when using this template application as a dependency.
 * @param {object} currentProcess - application 'process' object.
 * @returns {object} an express application.
 */
const createApp = (currentProcess = process) => {
  const newApp = express();

  // configure server
  newApp.use(middlewares.logReqResp());

  // uncaught promisse errors. Throw them to uncaughtException
  currentProcess.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise);
    throw reason;
  });

  currentProcess.on('Uncaught Exception', (error) => {
    console.error('uncaughtException', error);
    process.exit(1);
  });

  return newApp;
};

if (require.main === module) {
  app = createApp();

  app.use(helmet());
  app.use(express.json());

  // set endpoints
  Object
    .keys(api)
    .forEach(uri => app.use(uri, api[uri]));

  // set error handlers
  app.use(middlewares.errorHandler());

  app.listen(SERVER_PORT, (error) => { // eslint-disable-line
    if (error) {
      return console.error(error);
    }
    console.warn('Webserver started at', SERVER_PORT);
  });
}

module.exports = {
  ApiError,
  createApp,
  app,
  log,
  reqValidator: middlewares.reqValidator,
  reqHandler: middlewares.reqHandler,
};
