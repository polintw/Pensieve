const express = require('express');
const execute = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validatePasswordChangedInput = require('./validation/password');
const {verify_key} = require('../../config/jwt.js');
const {
  userImg_FirsttoSrc
} = require('../../config/path.js');
const {
  _select_Basic
} = require('../utils/dbSelectHandler.js');
const {
  _insert_basic
} = require('../utils/dbInsertHandler.js');
const {
  _DB_users,
  _DB_users_apply
} = require('../utils/sequelize');
const {
  _handler_ErrorRes,
  _handler_err_Unauthorized
} = require('../utils/reserrHandler.js');



//handle register request
function _handle_account_password_PATCH(req, res) {
  const { errors, isValid } = validatePasswordChangedInput(req.body);

  if(!isValid) {
    let errSet = {
      "status": 400,
      "message": errors,
      "console": ''
    };
    return _handler_ErrorRes(errSet, res);
  }

  const reqToken = req.body.token || req.headers['token'] || req.query.token;
  const jwtVerified = jwt.verify(reqToken, verify_key);
  if (!jwtVerified) _handler_err_Unauthorized(err, res);

  let mysqlForm = {
    accordancesList: [[jwtVerified.userId]]
  },
  conditionUser = {
    table: "verifications",
    cols: ["id_user", "password"],
    where: ["id_user"]
  };
  _select_Basic(conditionUser, mysqlForm.accordancesList).then((rows)=>{
    if(rows.length>0) {
      bcrypt.compare(req.body.password_old, rows[0].password).then(isMatch => {
        //bcrypt genSalt and hash new password, then Sequelize update to verifications
      })
      //not match, valid token but wrong password

    }else{
      //internal error

    }
  }).then((newUser)=>{



    //after confimation, create new user account officially.
    //first create user in users and get the user Id
    return _insert_basic({
      table: 'users',
      col: '(first_name, last_name, account, status)'},
      [[
        newUser.first_name,
        newUser.last_name,
        newUser.first_name+" "+newUser.last_name,
        'unverified'
      ]]
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
        //genSalt and hash user's password
        //use a new promise again is because, we don't want to append a new catch here
        return new Promise((resolve, reject)=>{
          bcrypt.genSalt(10, (err, salt) => {
            if(err) reject({status: 500, err: 'There was an error'+err});
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if(err) reject({status: 500, err: 'There was an error'+err});
              resolve(hash);
            })
          });
        }).then((hash)=>{
          let pinsertNewVerifi = Promise.resolve(_insert_basic({table: 'verifications', col: '(id_user, email, password)'}, [[userId, newUser.email, hash]]).catch((errObj)=>{throw errObj})),
              pinsertNewSheet = Promise.resolve(_insert_basic({table: 'sheets', col: '(id_user, gender, birthYear, birthMonth, birthDate)'}, [[userId, newUser.gender, newUser.birthYear, newUser.birthMonth, newUser.birthDate]]).catch((errObj)=>{throw errObj})),
              pinsertEmailToken = Promise.resolve(_insert_basic({table: 'users_apply', col: '(id_user, token_email, status)'}, [[userId, tokenEmail, 'unverified']]).catch((errObj)=>{throw errObj})),

          return Promise.all([pinsertNewVerifi, pinsertNewSheet, pinsertEmailToken, pcreateImgFolder]).then((results)=>{
            return deliverVerifiedMail(newUser, tokenEmail);
          });
        });
      })
    });
  }).then(()=>{
    //complete the process, and response to client
    console.log("POST: auth/register req: complete.")
    let resData = {};
    resData.error = 0;
    resData['message'] = {'status': 'Registered successfully! Please verify your email address'};
    res.status(201).json(resData);
  }).catch((errObj)=>{
    //catch errors, both custom and internal
    if(errObj.custom) _handler_ErrorRes(errObj.errSet, res);
    else{
      console.log("Error: during auth/register promise: "+errObj.err)
      let errSet = {
        "status": errObj.status?errObj.status:500,
        "message": {'warning': 'Internal Server Error, please try again later'},
        "console": 'Error Occured: Internal Server Error'
      };
      _handler_ErrorRes(errSet, res);
    }
  });
};





execute.patch('/', function(req, res){
  console.log('PATCH: account/password');
  _handle_account_password_PATCH(req, res);
})

module.exports = execute;
