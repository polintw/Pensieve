const jwt = require('jsonwebtoken');
const {verify_key} = require('../../../config/jwt.js');

function signRefresh = (payload)=>{
  return new Promise((resolve, reject)=>{
    jwt.sign(JSON.parse(JSON.stringify(payload)), verify_key, {
      expiresIn: '27d'
    }, (err, token) => {
      if(err){
        err = ('There is some error when refresh token' + err);
        reject({status: 500, err: err});
      }
      else {
        resolve(token);
      }
    });
  }).catch((err)=>{throw err}));
}

module.exports = signRefresh;
