'use strict';

const appConfig = require('./index');

module.exports = {
  development: {
    username: appConfig.db.user,
    password: appConfig.db.password,
    database: appConfig.db.name,
    host: appConfig.db.host,
    port: appConfig.db.port,
    dialect: appConfig.db.db_dialect,
  },
  production: {
    username: appConfig.db.user,
    password: appConfig.db.password,
    database: appConfig.db.name,
    host: appConfig.db.host,
    port: appConfig.db.port,
    dialect: appConfig.db.db_dialect,
  },
};