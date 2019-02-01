const {envDbConnection} = require('./.env.json');

module.exports = {
  "development": {
    host:envDbConnection.host,
    username:envDbConnection.user,
    password:envDbConnection.password,
    database:envDbConnection.database,
    port: envDbConnection.port,
    dialect: "mysql",
    operatorsAliases: false,
    define: {
      freezeTableName: true
    }
  },
  "test": {
    host:envDbConnection.host,
    username:envDbConnection.user,
    password:envDbConnection.password,
    database:envDbConnection.database,
    port: envDbConnection.port,
    dialect: "mysql",
    operatorsAliases: false,
    define: {
      freezeTableName: true
    }
  },
  "production": {
    host:envDbConnection.host,
    username:envDbConnection.user,
    password:envDbConnection.password,
    database:envDbConnection.database,
    port: envDbConnection.port,
    dialect: "mysql",
    dialectOptions: {

    },
    operatorsAliases: false,
    define: {
      freezeTableName: true
    }
  }
}
