const express = require('express');
const execute = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validatePasswordChangedInput = require('./validation/password');
const {verify_key} = require('../../config/jwt.js');
const {
  _select_Basic
} = require('../utils/dbSelectHandler.js');
const {
  _DB_verifications
} = require('../utils/sequelize');
const {
  _handle_ErrCatched,
  forbbidenError,
  internalError,
  authorizedError,
  notFoundError
} = require('../utils/reserrHandler.js');


//handle register request
function _handle_account_password_PATCH(req, res) {
  new Promise((resolve, reject)=>{
    const { errors, isValid } = validatePasswordChangedInput(req.body);

    if(!isValid) {
      throw new forbbidenError(errors, 186)
    }

    const reqToken = req.body.token || req.headers['token'] || req.query.token;
    const jwtVerified = jwt.verify(reqToken, verify_key);
    if (!jwtVerified) throw new internalError(jwtVerified, 131)

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
              return _DB_verifications.findOne({
                where: {id_user: jwtVerified.user_Id},
                attributes: ['id_user', 'password']
              }).then(verication => {
                return verication.update({ password: hash});
              }).then(()=>{
                Promise.resolve();
              })
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





execute.patch('/', function(req, res){
  console.log('PATCH: account/password');
  _handle_account_password_PATCH(req, res);
})

module.exports = execute;
