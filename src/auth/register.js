const express = require('express');
const execute = express.Router();
const fs = require('fs');
const path = require("path");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validateRegisterInput = require('./validation/register');
const deliverVerifiedMail = require('./validation/verifiedMail');
const {
  verify_email
} = require('../../config/jwt.js');
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
} = require('../utils/reserrHandler.js');

const _create_new_ImgFolder = (userId)=>{
  return new Promise((resolve,reject)=>{
    let imgFolderPath = path.join(__dirname, userImg_FirsttoSrc+userId);
    fs.mkdir(imgFolderPath, function(err){
      if(err) {reject({err: err});return;}
      resolve();
    })
  });
};

const _promise_customBreak_res = (errSet)=>{
  let errObj = {
    errSet: errSet,
    custom: true
  };
  return errObj;
}

//handle register request
function _handle_auth_register_POST(req, res) {
  const { errors, isValid } = validateRegisterInput(req.body);

  if(!isValid) {
    let errSet = {
      "status": 400,
      "message": errors,
      "console": ''
    };
    return _handler_ErrorRes(errSet, res);
  }

  let mysqlForm = {
    accordancesList: [[req.body.email]]
  },
  conditionUser = {
    table: "verifications",
    cols: ["email"],
    where: ["email"]
  };
  _select_Basic(conditionUser, mysqlForm.accordancesList).then((rows)=>{
    //distinguish iis the user already exist or not.
    if(rows.length>0) {
      let errSet = {
        "status": 400,
        "message": {'email': 'email already exist!'},
        "console": ''
      };
      throw _promise_customBreak_res(errSet);
    }else{
      const newUser = {
        email: req.body.email,
        password: req.body.password,
        first_name: req.body.firstName,
        last_name: req.body.lastName
      };
      return newUser;
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
              pinsertNewSheet = Promise.resolve(_insert_basic({table: 'sheets', col: '(id_user)'}, [[userId]]).catch((errObj)=>{throw errObj})),
              pinsertEmailToken = Promise.resolve(_insert_basic({table: 'users_apply', col: '(id_user, token_email, status)'}, [[userId, tokenEmail, 'unverified']]).catch((errObj)=>{throw errObj})),
              pcreateImgFolder = Promise.resolve(_create_new_ImgFolder(userId).catch((errObj)=>{throw errObj}));

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

function _handle_auth_registerConfirm_GET(req, res){
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
        cols: ["id_user, token_email,status"],
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
                  attributes: ['status']
                }).then(users => {
                  return users.update({ status: 'active'});
                }).then(()=>{
                  console.log("Sequelize: update an user's activity status at users.");
                }).catch((err)=>{throw {err: err}})  
              );
              let pupdateUsersApply = Promise.resolve(
                _DB_users_apply.findOne({
                  where: {user_Id: userId},
                  attributes: ['status']
                }).then(users => {
                  return users.update({ status: 'active'});
                }).then(()=>{
                  console.log("Sequelize: update an user's activity status at users_apply.");
                }).catch((err)=>{throw {err: err}})  
              );
              Promise.all([pupdateUsers, pupdateUsersApply]).then((results)=>{
                res.status(200).redirect('/s/confirm/success');
              }).catch((errObj)=> {throw errObj});
            }else{throw {custom: true, status: 401, path: '/s/confirm/fail', err: 'token_email inconsistent for user sended'}};
          }
        }else{
          throw {custom: true, status: 404, path: '/s/confirm/fail', err: 'no such user found '+userId};
        }
      }).catch((errObj)=>{
        //catch errors, both custom and internal
        if('err' in errObj) console.log("error catched during: auth/confirm register promise: "+errObj.err);
        errObj = Object.assign({status: 500, path: '/s/confirm/fail'}, errObj);
        res.status(errObj.status).redirect(errObj.path);
      });
    }
  })
}

execute.post('/', function(req, res){
  console.log('POST: auth/register');
  _handle_auth_register_POST(req, res);
})

execute.get('/confirm', function(req, res){
  console.log('GET: auth/confirm register');
  _handle_auth_registerConfirm_GET(req, res);
})

module.exports = execute;
