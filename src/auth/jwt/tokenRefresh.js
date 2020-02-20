const jwt = require('jsonwebtoken');
const winston = require('../../../config/winston.js');
const {verify_key_refresh} = require('../../../config/jwt.js');
const {
  internalError
} = require('../../utils/reserrHandler.js');

function signRefresh (payload){
  if(process.env.NODE_ENV == 'development') winston.verbose('utis: tokenRefresh ');

  return new Promise((resolve, reject)=>{
    jwt.sign(JSON.parse(JSON.stringify(payload)), verify_key_refresh, {
      expiresIn: '23d' //currently not safe enough so we set a not too long duration
    }, (err, token) => {
      if(err){
        err = ('There is some error when refresh token' + err);
        reject(new internalError(err, 131));
      }
      else {
        resolve(token);
      }
    });
  }).catch((err)=>{throw err});
}

module.exports = signRefresh;
