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
  internalError
} = require('../utils/reserrHandler.js');


//handle register request
function _handle_account_password_PATCH(req, res) {
  const { errors, isValid } = validatePasswordChangedInput(req.body);

  if(!isValid) {
    throw new forbbidenError(errors, 186)
  }

  const reqToken = req.body.token || req.headers['token'] || req.query.token;
  const jwtVerified = jwt.verify(reqToken, verify_key);
  if (!jwtVerified) throw new internalError(jwtVerified, 131)

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
      return bcrypt.compare(req.body.password_old, rows[0].password).then(isMatch => {
        //bcrypt genSalt and hash new password, then Sequelize update to verifications
        if(isMatch){
          return new Promise((resolve, reject)=>{
            bcrypt.genSalt(10, (err, salt) => {
              if(err) reject();//500
              bcrypt.hash(req.body.password, salt, (err, hash) => {
                if(err) reject();//500
                resolve(hash);
              })
            });
          }).then((hash)=>{
            return _DB_verifications.findOne({
              where: {id_user: jwtVerified.userId},
              attributes: ['id_user', 'password']
            }).then(verication => {
              return verication.update({ password: hash});
            }).then(()=>{
              Promise.resolve();
            })
          })
        }
        else{
          //401, twitter code 32, current password is not correct
        }
      })
    }else{
      //404, twitter code 17, no such user found

    }
  }).then(()=>{
    //complete the process, and response to client
    console.log("PATCH: account/password: complete.")
    let resData = {};
    resData.error = 0;
    resData['message'] = {'warning': 'Your password has been changed successfully!'};
    res.status(200).json(resData);
  }).catch((error)=>{
    throw error;
  });
};





execute.patch('/', function(req, res){
  console.log('PATCH: account/password');
  try {
    _handle_account_password_PATCH(req, res);
  } catch (error) {
    _handle_ErrCatched(error);
  }
})

module.exports = execute;
