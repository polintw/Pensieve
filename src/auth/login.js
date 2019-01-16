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
      let resData = {};
      if (rows.length > 0) {
        let verified = rows[0];
        console.log(password);
        console.log(verified.password)
        bcrypt.compare(password, verified.password).then(isMatch => {
          if(isMatch) {
              const payload = {
                user_Id: verified['id_user'],
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
      } else {
        let errSet = {
          "status": 404,
          "message": {'email': 'account does not exist!'},
          "console": ''
        };
        return _handler_ErrorRes(errSet, res);
      }
    }).catch((errObj)=>{
      console.log("Error occured during: auth/login promise: "+errObj.err)
      let errSet = {
        "status": errObj.status,
        "message": {'warning': 'Internal Server Error, please try again later'},
        "console": 'Error Occured: Internal Server Error'
      };
      _handler_ErrorRes(errSet, res);
    });
  });

  module.exports = login;
