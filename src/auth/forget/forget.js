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
  notFoundError,
  tooManyReqError
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
      return reject( new forbbidenError(errors, 186));
    }

    _DB_users.findOne({ //check the user mail indicated
      where: {email: req.body.email},
      attributes: ['id', 'status', 'first_name']
    }).then(user =>{
      // the email do not match any user
      if(!user) { throw new notFoundError({"email": "please using a valid email address."}, 50);}
      // it's unreasonable to reset a password even before verified
      if(user.status == 'unverified' || user.status == 'frequentUnverified'){
        throw new forbbidenError({"warning:": "Your email hasn't verified yet. Verifying it to sign in, or resending verifications."}, 87);
      };
      return user;
    })
    .then((user)=>{
      return _DB_users_apply.findOne({ //checking the time last req
        where: {id_user: user.id}
      })
      .then((resultApply)=>{
        // checking the frequency here, in order to update if needed
        let frequentify = false;
        if(!!resultApply.updatedAt){ // only need if the updatedAt ia not NULL
          // prepare time for later compare
          let dateNow = new Date(),
              dateLastReq = new Date(resultApply.updatedAt);
          let nowTime = dateNow.getTime(),
              lastReqTime = dateLastReq.getTime();
          let timeLimit = (user.status == "frequentForget") ? 2400000 : 1200000; // 40min / 20min
          //if req twice less than timeLimit
          if((nowTime - lastReqTime) < timeLimit) frequentify = true;
        };
        if(user.status == "frequentForget" && frequentify){
          throw new tooManyReqError({"warning": "Havn't seen the mail? Take a look at spam folder, or take a rest before it came. You could resend the mail again 30 mins later."}, 150);
        }
        else return frequentify; // condition incl.: false, not in timeLimit; true, but status == 'active' or other.
      })
      .then((frequentify)=>{
        // now, let's start sending a mail with link
        return new Promise((resolveJWT, rejectJWT)=>{
          const payload = {
            user_Id: user.id,
            token_property: 'pwForget'
          };
          jwt.sign(JSON.parse(JSON.stringify(payload)), verify_forget, {
            expiresIn: '1d'
          }, (err, token) => {
            if(err){
              rejectJWT(new internalError({"warning": "jwt.sign error in forget/password.js"}, 131));
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
            if(frequentify && user.status != 'frequentForget'){
              return _DB_users.update(
                {status: 'frequentForget'},
                {where: { id: user.id}}
              )
              .then(()=>{
                return;
              })
            }
            else return;
          }).then(()=>{
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
      })
      .catch((error)=>{throw error});

    }).then(()=>{
      //complete the process, and response to client
      let resData = {
        "code": "",
        "message": {"warning": "Password resetting link has been sent to email address you input."},
        "console": ""
      };
      res.status(200).json(resData);
      resolve();
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
