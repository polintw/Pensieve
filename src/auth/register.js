const express = require('express');
const register = express.Router();
const fs = require('fs');
const path = require("path");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const {verify_key} = require('../../config/jwt.js');
const validateRegisterInput = require('./validation/register');
const {
  _select_Basic
} = require('../utils/dbSelectHandler.js');
const {
  _insert_basic
} = require('../utils/dbInsertHandler.js');
const {
  _handler_ErrorRes,
  _handler_err_NotFound,
  _handler_err_BadReq,
  _handler_err_Unauthorized,
  _handler_err_Internal
} = require('../utils/reserrHandler.js');

const _create_new_ImgFolder = (userId)=>{
  return new Promise((resolve,reject)=>{
    let imgFolderPath = path.join(__dirname, '/../..', '/faked_Pics/'+userId);
    fs.mkdir(imgFolderPath, function(err){
      if(err) {reject(err);return;}
      resolve();
    })
  });
};

//handle register request
register.use(function(req, res) {
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
    if(rows.length>0) {
      let errSet = {
        "status": 400,
        "message": {'email': 'email already exist!'},
        "console": ''
      };
      return _handler_ErrorRes(errSet, res);
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
                    const userId = resultObj.insertId;
                    let pinsertNewVerifi = Promise.resolve(_insert_basic({table: 'verifications', col: '(id_user, email, password)'}, [[userId, newUser.email, hash]])),
                        pinsertNewSheet = Promise.resolve(_insert_basic({table: 'sheets', col: '(id_user)'}, [[userId]])),
                        pcreateImgFolder = Promise.resolve(_create_new_ImgFolder(userId));
                    return Promise.all([pinsertNewVerifi, pinsertNewSheet, pcreateImgFolder]);
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
    let errSet = {
      "status": errObj.status,
      "message": {'warning': 'Internal Server Error, please try again later'},
      "console": 'Error Occured: Internal Server Error'
    };
    _handler_ErrorRes(errSet, res);
  });
});

module.exports = register;
