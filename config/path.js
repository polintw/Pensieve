const {
  envSeedPath,
  envImgPath
} = require('./.env.json');

exports.userImg = envImgPath;

exports.dbSeed = envSeedPath;
