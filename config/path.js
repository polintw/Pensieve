const {
  envSeedPath,
  envLogPath
} = require('./.env.json');

exports.dbSeed = envSeedPath;

exports.logPath = envLogPath;
