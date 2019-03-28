const {
  envImgPath,
  envSeedPath
} = require('./.env.json');

exports.userImg_FirsttoSrc = envImgPath.FirsttoSrc;

exports.userImg_SecondtoSrc = envImgPath.SecondtoSrc;

exports.dbSeed = envSeedPath;
