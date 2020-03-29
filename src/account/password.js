const express = require('express');
const execute = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Validator = require('validator');
const deliverVerifiedMail = require('./verifiedMail.js');
const validatePasswordChangedInput = require('./validation/password');
const {
  verify_key,
  verify_forget
} = require('../../config/jwt.js');
const {
  _select_Basic
} = require('../utils/dbSelectHandler.js');
const _DB_verifications = require('../../db/models/index').verifications;
const _DB_users = require('../../db/models/index').users;
const _DB_users_apply = require('../../db/models/index').users_apply;
const {
  _handle_ErrCatched,
  forbbidenError,
  internalError,
  authorizedError,
  notFoundError
} = require('../utils/reserrHandler.js');

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

//handle register request
function _handle_account_password_PATCH(req, res) {
  new Promise((resolve, reject)=>{
    const { errors, isValid } = validatePasswordChangedInput(req.body);

    if(!isValid) {
      throw new forbbidenError(errors, 186)
    }

    const reqToken = req.body.token || req.headers['token'] || req.query.token;
    const jwtVerified = jwt.verify(reqToken, verify_key);
    if (!jwtVerified) throw new authorizedError(jwtVerified, 32)

    let mysqlForm = {
      accordancesList: [[jwtVerified.user_Id]]
    },
    conditionUser = {
      table: "verifications",
      cols: ["id_user", "password"],
      where: ["id_user"]
    };
    _select_Basic(conditionUser, mysqlForm.accordancesList).then((rows)=>{
      if(rows.length>0) {
        return bcrypt.compare(req.body.password_old, rows[0].password).then(isMatch => {
          //bcrypt genSalt and hash new password, then Sequelize update to verifications
          if(isMatch){
            return new Promise((resolveBcrypt, rejectBcrypt)=>{
              bcrypt.genSalt(10, (err, salt) => {
                if(err) rejectBcrypt(new internalError('bcrypt.genSalt error in account/password.js', 131));
                bcrypt.hash(req.body.password, salt, (err, hash) => {
                  if(err) rejectBcrypt(new internalError('bcrypt.hash error in account/password.js', 131));
                  resolveBcrypt(hash);
                })
              });
            }).then((hash)=>{
              //it's bad to use 'findOne' before update, the result instance is not proper here
              return _DB_verifications.update(
                { password: hash },
                { where: { id_user: jwtVerified.user_Id } }
              )
            })
          }
          else{
            throw new authorizedError({"password_old": "inputed password was wrong."}, 32)
          }
        })
      }else{
        throw new notFoundError({"log": "no such user though with valid token in account/password.js"}, 144)
      }
    }).then(()=>{
      //complete the process, and response to client
      console.log("PATCH: account/password: complete.")
      let resData = {};
      resData.error = 0;
      resData['message'] = {'warning': 'Your password has been changed successfully!'};
      res.status(200).json(resData);
      resolve();
    }).catch((error)=>{reject(error);}); // this line is neccessary for promise in promise
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
};


execute.patch('/mail', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('PATCH: account/password/mail');
  _handle_password_ForgetResend_PATCH(req, res));
})

execute.patch('/', function(req, res){
  console.log('PATCH: account/password');
  _handle_account_password_PATCH(req, res);
})


module.exports = execute;
