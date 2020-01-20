const {
  envImgPath,
  envSeedPath
} = require('./.env.json');

exports.userImg = envImgPath;

exports.dbSeed = envSeedPath;
