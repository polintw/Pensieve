const express = require('express');
const login = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const {verify_key} = require('../../config/jwt.js');
const validateLoginInput = require('./validation/login');
const {
  _handler_err_NotFound,
  _handler_err_BadReq,
  _handler_err_Unauthorized,
  _handler_err_Internal
} = require('../utils/reserrHandler.js');


//handle log in request
login.use(function(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const { errors, isValid } = validateLoginInput(req.body);

    if(!isValid) {
        return _handler_err_BadReq(errors, res);
    }

    let mysqlForm = {
      accordancesList: [[email]]
    },
    conditionUser = {
      table: "verifications",
      cols: ["email", "password"],
      where: ["email"]
    };
    _select_Basic(conditionUser, mysqlForm.accordancesList).then((rows)=>{
      let resData = {};
      if (rows.length > 0) {
        let verified = rows[0];
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
            resData['error'] = 1;
            resData['message'] = 'account and Password does not match';
            res.status(401).json(resData);
          }
        });
      } else {
        throw {status: 404, err: 'account does not exist!'};
      }
    }).catch((errObj)=>{
      console.log("error occured during: auth/login promise: "+errObj.err)
      switch (errObj.status) {
        case 400:
          _handler_err_BadReq(errObj.err, res);
          break;
        case 404:
          _handler_err_NotFound(errObj.err, res);
          break;
        case 500:
          _handler_err_Internal(errObj.err, res);
          break;
        default:
          _handler_err_Internal(errObj.err?errObj.err:errObj, res);
      }
    });
  });

  module.exports = login;
