## Database

```
$ ./node_modules/.bin/sequelize db:migrate --env dev # create database
$ ./node_modules/.bin/sequelize db:migrate:undo:all --env dev # remove database
$ ./node_modules/.bin/sequelize db:seed:all --env dev # insert default data
$ ./node_modules/.bin/sequelize db:seed:undo:all --env dev # delete all data
```
