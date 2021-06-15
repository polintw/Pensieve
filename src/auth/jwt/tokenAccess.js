const jwt = require('jsonwebtoken');
const {verify_key} = require('../../../config/jwt.js');

function signAccess(payload){
  return new Promise((resolve, reject)=>{
    jwt.sign(JSON.parse(JSON.stringify(payload)), verify_key, {
      expiresIn: '3d'
    }, (err, token) => {
      if(err){
        err = ('There is some error in token' + err);
        reject({status: 500, err: err});
      }
      else {
        resolve(token);
      }
    });
  }).catch((err)=>{throw err});
}

module.exports = signAccess;
