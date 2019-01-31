const {envDbConnection} = require('./.env.json');

module.exports = {
  "development": {
    host:envDbConnection.host,
    user:envDbConnection.user,
    password:envDbConnection.password,
    database:envDbConnection.database,
    port: envDbConnection.port,
    dialect: "mysql"
  },
  "test": {
    host:envDbConnection.host,
    user:envDbConnection.user,
    password:envDbConnection.password,
    database:envDbConnection.database,
    port: envDbConnection.port,
    dialect: "mysql"
  },
  "production": {
    host:envDbConnection.host,
    user:envDbConnection.user,
    password:envDbConnection.password,
    database:envDbConnection.database,
    port: envDbConnection.port,
    dialect: "mysql",
    dialectOptions: {
      
    }
  }
}
