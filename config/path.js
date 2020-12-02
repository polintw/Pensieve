const {
  envSeedPath,
  envImgPath
} = require('./.env.json');

exports.userImg = envImgPath.users;
exports.marketingImgs = envImgPath.marketing;

exports.dbSeed = envSeedPath;
