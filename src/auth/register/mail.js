const path = require("path");
const jwt = require('jsonwebtoken');
const Validator = require('validator');
const deliverVerifiedMail = require('./verifiedMail.js');
const {
  verify_email
} = require('../../../config/jwt.js');
const winston = require('../../../config/winston.js');
const {
  _select_Basic
} = require('../../utils/dbSelectHandler.js');
const _DB_users = require('../../../db/models/index').users;
const _DB_users_apply = require('../../../db/models/index').users_apply;
const {
  _handle_ErrCatched,
  forbbidenError,
  internalError,
  authorizedError,
  notFoundError
} = require('../../utils/reserrHandler.js');
const isEmpty = require('../../utils/isEmpty');

function _handle_auth_mailConfirm_GET(req, res){
  const reqToken = req.body.token || req.headers['token'] || req.query.token;
  jwt.verify(reqToken, verify_email, function(err, payload) {
    if (err) {
      winston.error(`${"Error: JWT verify, "} - ${err} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
      res.status(401).redirect('/s/confirm/fail');
    } else {
      let userId = payload.user_Id;
      let mysqlForm = {
        accordancesList: [[userId]]
      },
      conditionUser = {
        table: "users_apply",
        cols: ["id_user", "token_email","status"],
        where: ["id_user"]
      };
      _select_Basic(conditionUser, mysqlForm.accordancesList).then((rows)=>{
        if(rows.length>0){
          let applyData = rows[0];
          if(applyData.status == 'active') throw {custom: true, status: 302, path: '/s/confirm/success'};
          else{
            if(reqToken == applyData.token_email){
              let pupdateUsers = Promise.resolve(
                _DB_users.findOne({
                  where: {id: userId},
                  attributes: ['id', 'status']
                }).then(users => {
                  return users.update(
                    { status: 'active'},
                    {where: {id: userId}}
                  );
                }).catch((err)=>{console.log('error from pupdateUsers');throw {err: err}})
              );
              let pupdateUsersApply = Promise.resolve(
                //it's bad to use 'findOne' before update, the result instance is not proper here
                _DB_users_apply.update(
                  {status:'active'},
                  {where:{id_user: userId}}
                ).catch((err)=>{console.log('error from pupdateUsersApply');throw {err: err}})
              );
              return Promise.all([pupdateUsers, pupdateUsersApply]).then((results)=>{
                res.status(200).redirect('/s/confirm/success');
              });
            }else{throw {custom: true, status: 401, path: '/s/confirm/fail', err: 'token_email inconsistent for user sended'}};
          }
        }else{
          throw {custom: true, status: 404, path: '/s/confirm/fail', err: 'no such user found '+userId};
        }
      }).catch((errObj)=>{
        //catch errors, both custom and internal
        if('err' in errObj) console.log("Error catched during: auth/confirm register promise: "+errObj.err);
        errObj = Object.assign({status: 500, path: '/s/confirm/fail'}, errObj);
        res.status(errObj.status).redirect(errObj.path);
      });
    }
  })
}

function _handle_auth_mailResend_PATCH(req, res){
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
      if(!user){ throw new notFoundError({"email": "this email hasn't sign up yet!"}, 50); return ;};

      switch (user.status) {
        case 'unverified':
          //start to send email verification again
          return new Promise((resolveJWT, rejectJWT)=>{
          //sign a token for email verification
            const payload = {
              user_Id: user.id,
              token_property: 'emailVerified'
            };
            jwt.sign(JSON.parse(JSON.stringify(payload)), verify_email, {
              expiresIn: '1d'
            }, (err, token) => {
              if(err){
                rejectJWT(new internalError("jwt.sign error in register/mail.js", 131));
              }
              else {
                resolveJWT(token);
              }
            });
          }).then((tokenEmail)=>{
            //update this token into users_apply
            return _DB_users_apply.update(
              { token_email: tokenEmail},
              { where: { id_user: user.id } }
            ).then(()=>{
              return tokenEmail;
            })
          }).then((tokenEmail)=>{
            //finally, sending the mail to the user
            let userInfo = {
              email: req.body.email,
              first_name: user.first_name
            }
            return deliverVerifiedMail(userInfo, tokenEmail);
          }).catch((error)=>{throw error}); // this line is neccessary for promise in promise
          break;
        default:
          throw new forbbidenError({"warning:": "Your email had been verified, could sign in directly."}, 87)
      }
    }).then(()=>{
      //complete the process, and response to client
      let resData = {
        "code": "",
        "message": {"warning": "Verification has been sended again to your email address."},
        "console": ""
      };
      res.status(200).json(resData);
    }).catch((error)=>{reject(error);}); // this line is neccessary for promise in promise
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

module.exports = {
  _handle_auth_mailConfirm_GET,
  _handle_auth_mailResend_PATCH
};
