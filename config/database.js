const {envDbConnection} = require('./.env.json');

const connection_key = {
  connectionLimit: 100,
  host:envDbConnection.host,
  user:envDbConnection.user,
  password:envDbConnection.password,
  database:envDbConnection.database,
  port: envDbConnection.port,
  debug: false,
  multipleStatements: true
};


module.exports.connection_key = connection_key;
