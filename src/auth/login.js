const express = require('express');
const login = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const {verify_key} = require('../../config/jwt.js');
const validateLoginInput = require('./validation/login');
const {
  _select_Basic
} = require('../utils/dbSelectHandler.js');
const {
  _handler_ErrorRes
} = require('../utils/reserrHandler.js');
const {
  client,
  getAsync
} = require('../redis.js');


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

    /*redis, implement trial
    getAsync("loginattemp_"+email).then((cache)=>{
      if(cache >4)
    })*/
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
            if(rowsUsers[0].status == 'active') Promise.resolve();
            else {
              let errSet = {
                "status": 401,
                "message": {'warning': "You haven't verified your email address yet!"},
                "console": '',
                "code": 33
              };
              throw {custom: true, errSet: errSet};
            }
          }
        }).then(()=>{
          let resData = {};
          bcrypt.compare(password, verified.password).then(isMatch => {
            if(isMatch) {
                const payload = {
                  user_Id: userId,
                  user_Role: 'public'
                }
                jwt.sign(JSON.parse(JSON.stringify(payload)), verify_key, {
                  expiresIn: '1d'
                }, (err, token) => {
                    if(err){
                      err = ('There is some error in token' + err);
                      throw {status: 500, err: err};
                    }
                    else {
                      resData['token'] = token;
                      resData['error'] = 0;
                      resData['message'] = 'login success!';
                      res.status(200).json(resData);
                    }
                });
            }
            else {
              let errSet = {
                "status": 401,
                "message": {'password': 'account and Password does not match'},
                "console": ''
              };
              return _handler_ErrorRes(errSet, res);
            }
          });
        })
      } else {
        let errSet = {
          "status": 404,
          "message": {'email': 'account does not exist!'},
          "console": ''
        };
        return _handler_ErrorRes(errSet, res);
      }
    }).catch((errObj)=>{
      /*let redisKey = "loginattemp_"+email;
      getAsync(redisKey).then((cache)=>{
        let nextNum = 1;
        if(redisKey) nextNum = Number(cache)+1;
        client.set(redisKey, nextNum.toString(), 'EX', 600)//set a redis key expired after 10min.
      })*/

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
