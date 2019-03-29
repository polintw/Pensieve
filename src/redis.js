//initiate redis as a session pool
const winston = require('../config/winston.js');

const redis = require("redis"),
  client = redis.createClient();

  client.on("error", function (err) {
    winston.error(`${"Error: from redis when initiation: "} ${err}`);
  });

const {promisify} = require('util');
const getAsync = promisify(client.get).bind(client);

module.exports = {
  client: client,
  getAsync: getAsync
};
