const express = require('express');
const login = express.Router();
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const validateLoginInput = require('./validation/login');
const signAccess = require('./jwt/tokenAccess.js');
const signRefresh = require('./jwt/tokenRefresh.js');
const {
  _select_Basic
} = require('../utils/dbSelectHandler.js');
const {
  _handler_ErrorRes
} = require('../utils/reserrHandler.js');

//handle log in request
login.use(function(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const { errors, isValid } = validateLoginInput(req.body);

    if(!isValid) {
      let errSet = {
        "status": 400,
        "message": errors,
        "console": ''
      };
      return _handler_ErrorRes(errSet, res);
    }

    let mysqlForm = {
      accordancesList: [[email]]
    },
    conditionUser = {
      table: "verifications",
      cols: ["email", "password", "id_user"],
      where: ["email"]
    };
    _select_Basic(conditionUser, mysqlForm.accordancesList).then((rows)=>{
      if (rows.length > 0) {
        let verified = rows[0];
        let userId = verified['id_user'];
        let mysqlForm = {
          accordancesList: [[userId]]
        },
        conditionUser = {
          table: "users",
          cols: ["status"],
          where: ["id"]
        };
        return _select_Basic(conditionUser, mysqlForm.accordancesList).then((rowsUsers)=>{
          if(rowsUsers.length == 0){
            throw {custom: false, status: 500, err: "existed email in verications couldn't be found in users"};
          }
          else{
            if(rowsUsers[0].status == 'unverified' || rowsUsers[0].status == 'frequentUnverified'){
              let errSet = {
                "status": 401,
                "message": {'warning': "You haven't verified your email yet"},
                "console": '',
                "code": 33
              };
              throw {custom: true, errSet: errSet};
            }
            else  Promise.resolve();
          }
        }).then(()=>{
          let resData = {};
          return bcrypt.compare(password, verified.password).then(isMatch => {
            if(isMatch) {
                const payload = {
                  user_Id: userId,
                  user_Role: 'public'
                }
                //return to higher for unified error handling
                return Promise.all([
                  signAccess(Object.assign({}, {token_: 'access'}, payload)),
                  signRefresh(Object.assign({}, {token_: 'refresh'}, payload))
                ]).then((arrResults)=>{
                  //res both access token & refresh token
                  resData['token'] = arrResults[0];
                  resData['tokenRefresh'] = arrResults[1];
                  resData['error'] = 0;
                  resData['message'] = 'login success!';
                  res.status(200).json(resData);
                })
            }
            else {
              let errSet = {
                "status": 401,
                "message": {'password': 'Email and Password does not match'},
                "console": ''
              };
              return _handler_ErrorRes(errSet, res);
            }
          });
        })
      } else {
        let errSet = {
          "status": 404,
          "message": {'email': 'account does not exist'},
          "console": ''
        };
        return _handler_ErrorRes(errSet, res);
      }
    }).catch((errObj)=>{
      if(errObj.custom) _handler_ErrorRes(errObj.errSet, res);
      else{
        console.log("error occured during: auth/login promise: "+errObj.err);
        let errSet = {
          "status": errObj.status?errObj.status:500,
          "message": {'warning': 'Internal Server Error, please try again later'},
          "console": 'Error Occured: Internal Server Error'
        };
        _handler_ErrorRes(errSet, res);
      }
    });
  });

  module.exports = login;
