const path = require("path");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const deliverVerifiedMail = require('./verifiedMail');
const validateRegisterInput = require('../validation/register');
const {
  verify_email
} = require('../../../config/jwt.js');
const {
  _select_Basic
} = require('../../utils/dbSelectHandler.js');
const {
  _insert_basic
} = require('../../utils/dbInsertHandler.js');
const {
  _DB_users,
  _DB_users_apply
} = require('../../utils/sequelize');
const {
  _handler_ErrorRes,
} = require('../../utils/reserrHandler.js');

function _handle_auth_mailConfirm_GET(req, res){
  const reqToken = req.body.token || req.headers['token'] || req.query.token;
  jwt.verify(reqToken, verify_email, function(err, payload) {
    if (err) {
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
                  return users.update({ status: 'active'});
                }).catch((err)=>{throw {err: err}})
              );
              let pupdateUsersApply = Promise.resolve(
                _DB_users_apply.findOne({
                  where: {id_user: userId},
                  attributes: ['status']
                }).then(usersApply => {
                  return usersApply.update({ status: 'active'});
                }).catch((err)=>{throw {err: err}})
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

function _handle_auth_mailResend_GET(req, res){

  const { errors, isValid } = validateRegisterInput(req.body);

  if(!isValid) {
    throw new forbbidenError(errors, 186)
  }

  _DB_users.findOne({
    where: {email: req.body.email},
    attributes: ['id', 'status']
  }).then(user =>{
    return _DB_users_apply.findOne({
      where: {id_user: userId},
      attributes: ['status']
    });
  })
  _DB_users_apply.findOne({
    where: {id_user: userId},
    attributes: ['status']
  }).then(usersApply => {
    return usersApply.update({ status: 'active'});
  }).catch((err)=>{throw {err: err}})

    ).then((resultObj)=>{
      const userId = resultObj.insertId;
      return new Promise((resolve, reject)=>{
        //sign a token for email verification
        const payload = {
          user_Id: userId,
          token_property: 'emailVerified'
        };
        jwt.sign(JSON.parse(JSON.stringify(payload)), verify_email, {
          expiresIn: '1d'
        }, (err, token) => {
            if(err){
              reject({status: 500, err: 'There is some error in token ' + err});
            }
            else {
              resolve(token);
            }
        });
      }).then((tokenEmail)=>{

          return Promise.all([pinsertNewVerifi, pinsertNewSheet, pinsertEmailToken, pcreateImgFolder]).then((results)=>{
            return deliverVerifiedMail(newUser, tokenEmail);
          });
        });
      })
    });
  }).then(()=>{
    //complete the process, and response to client
    console.log("PATCH: account/password: complete.")
    let resData = {};
    resData.error = 0;
    resData['message'] = {'warning': 'Your password has been changed successfully!'};
    res.status(200).json(resData);
    resolve();
  }).catch((error)=>{reject(error);}); // this line is neccessary for promise in promise


}

module.exports = {
  _handle_auth_mailConfirm_GET,
  _handle_auth_mailResend_GET
};
