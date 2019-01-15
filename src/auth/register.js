const express = require('express');
const register = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const {verify_key} = require('../../config/jwt.js');
const validateRegisterInput = require('./validation/register');
const {
  _handler_err_NotFound,
  _handler_err_BadReq,
  _handler_err_Unauthorized,
  _handler_err_Internal
} = require('../utils/reserrHandler.js');

//handle register request
register.use(function(req, res) {
  const { errors, isValid } = validateRegisterInput(req.body);

  if(!isValid) {
      return _handler_err_BadReq(errors, res);
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
    if(rows.length>0) {
      throw {
        status: 400,
        err: 'Email already exists'
      };
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
    bcrypt.genSalt(10, (err, salt) => {
        if(err) throw {status: 500, err: 'There was an error'+err};
        else {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if(err) throw {status: 500, err: 'There was an error'+err};
              else {
                return _insert_basic({table: 'users', col: '(first_name, last_name, account)'},
                  [[newUser.first_name, newUser.last_name, newUser.first_name+" "+newUser.last_name]]).then((resultObj)=>{
                    const userId = resultObj.insertId
                    let pinsertNewVerifi = Promise.resolve(_insert_basic({table: 'verifications', col: '(id_user, email, password)'}, [[userId, newUser.email, hash]])),
                        pinsertNewSheet = Promise.resolve(_insert_basic({table: 'sheets', col: '(id_user)'}, [[userId]]));
                    return Promise.all([pinsertNewVerifi, pinsertNewSheet])
                  }).then(()=>{
                    let resData = {};
                    resData.error = 0;
                    resData['message'] = 'User registered successfully!';
                    res.status(201).json(resData);
                  })
              }
            });
        }
    });
  }).catch((errObj)=>{
    console.log("error occured during: auth/register promise: "+errObj.err)
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

module.exports = register;
