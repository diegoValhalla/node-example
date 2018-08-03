#!/bin/sh

if [ "$NODE_ENV" = "local" ]; then
  npm run 'local'
elif [ "$NODE_ENV" = "development" ]; then
  npm run 'dev'
elif [ "$NODE_ENV" = "staging" ]; then
  npm run 'staging'
elif [ "$NODE_ENV" = "production" ]; then
  npm run 'production'
fi
