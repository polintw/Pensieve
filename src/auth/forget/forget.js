const express = require('express');
const execute = express.Router();
const jwt = require('jsonwebtoken');
const Validator = require('validator');
const deliverVerifiedMail = require('./verifiedMail.js');
const winston = require('../../../config/winston.js');
const {
  verify_forget
} = require('../../../config/jwt.js');
const _DB_users = require('../../../db/models/index').users;
const _DB_users_apply = require('../../../db/models/index').users_apply;
const {
  _handle_ErrCatched,
  forbbidenError,
  internalError,
  notFoundError
} = require('../../utils/reserrHandler.js');
const isEmpty = require('../../utils/isEmpty');

function _handle_password_ForgetResend_PATCH(req, res){
  new Promise((resolve, reject)=>{
    //input format validation first
    let errors = {};
    req.body.email = !isEmpty(req.body.email) ? req.body.email : '';
    if(!Validator.isEmail(req.body.email)) {
        errors.email = 'Email is invalid';
    }
    if(Validator.isEmpty(req.body.email)) {
        errors.email = 'Email is required';
    }
    let isValid = isEmpty(errors);
    if(!isValid) {
      throw new forbbidenError(errors, 186)
    }

    _DB_users.findOne({
      where: {email: req.body.email},
      attributes: ['id', 'status', 'first_name']
    }).then(user =>{
      if(!user) throw new notFoundError({"email": "please using a valid email address."}, 50);
      switch (user.status) {
        case 'unverified': // it's unreasonable to reset a password even before verified
          throw new forbbidenError({"warning:": "Your email hasn't verified yet. Verifying it to sign in, or resending verifications."}, 87)
          break;
        default:
          return new Promise((resolveJWT, rejectJWT)=>{
            const payload = {
              user_Id: user.id,
              token_property: 'pwForget'
            };
            jwt.sign(JSON.parse(JSON.stringify(payload)), verify_forget, {
              expiresIn: '30m'
            }, (err, token) => {
              if(err){
                rejectJWT(new internalError("jwt.sign error in account/password.js", 131));
              }
              else {
                resolveJWT(token);
              }
            });
          }).then((tokenPwForget)=>{
            //update this token into users_apply
            return _DB_users_apply.update(
              { token_email: tokenPwForget},
              { where: { id_user: user.id } }
            ).then(()=>{
              return tokenPwForget;
            })
          }).then((tokenPwForget)=>{
            //finally, sending the mail to the user
            let userInfo = {
              email: req.body.email,
              first_name: user.first_name
            }
            return deliverVerifiedMail(userInfo, tokenPwForget);
          }).catch((error)=>{throw error}); // this line is neccessary for promise in promise

      }
    }).then(()=>{
      //complete the process, and response to client
      let resData = {
        "code": "",
        "message": {"warning": "Resetting mail has been sent to email address you typed."},
        "console": ""
      };
      res.status(200).json(resData);
    }).catch((error)=>{reject(error);}); // this line is neccessary for promise in promise
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

execute.patch('/password', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('PATCH: auth, forget/password');
  _handle_password_ForgetResend_PATCH(req, res);
})


module.exports = execute;
