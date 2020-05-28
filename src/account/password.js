const express = require('express');
const execute = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Validator = require('validator');
const validatePasswordChangedInput = require('./validation/password');
const {
  verify_key,
} = require('../../config/jwt.js');
const {
  _select_Basic
} = require('../utils/dbSelectHandler.js');
const _DB_verifications = require('../../db/models/index').verifications;
const {
  _handle_ErrCatched,
  forbbidenError,
  internalError,
  authorizedError,
  notFoundError
} = require('../utils/reserrHandler.js');
const isEmpty = require('../utils/isEmpty');

//handle register request
async function _handle_account_password_PATCH(req, res) {
  // Notice! userId here hass special meaning if req has 'forget' in query: forget passwrd only depend on token is passed, not going ot compare anything. userId here means it's already passed the checkpoint
  const userId = req.extra.tokenUserId; //use userId passed from pass.js
  const isForget = !!req.query.forget; // detect if reset from password forget

  //validation
  try{
    // validte format first
    let { validationErrors, isValid } = validatePasswordChangedInput(req.body); // notice! don't use 'const' to announce because we might modify 'isValid' later

    if(!isForget){ // there should be a old password if not from forget password
      req.body.password_old = !isEmpty(req.body.password_old) ? req.body.password_old : '';
      if (Validator.isEmpty(req.body.password_old)) {
        validationErrors.password_old = 'Current password is required.';
        isValid= false; //must be false if the password_old was not valid
      };
    }

    if(!isValid) {
      throw new forbbidenError(validationErrors, 186);
    };

    /*
    this api, should set up a 'limit' to limit user reset passwrd again and again,
    no matter by old password, or by token
    */
      // checking last req time
    const resultVeri = await _DB_verifications.findOne({
      where: {id_user: userId}
    });
    // compare time interval
    let dateNow = new Date(),
    dateLastReq = new Date(!!resultVeri.updatedAt? resultVeri.updatedAt : 1586946370000);
    let nowTime = dateNow.getTime(),
    lastReqTime = dateLastReq.getTime();
    let timeLimit =  43200000; // 12hr
    //if req twice less than timeLimit
    if((nowTime - lastReqTime) < timeLimit){
      throw new forbbidenError( {"warning": "You shouldn't change your password so often."} , 77);
    };
  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return ; //close the process
  }

  //everything was checked, go update
  new Promise((resolve, reject)=>{
    let oldPassCompare = ()=>{
      //first, if this was called from forget password, no need to compare old password
      if(isForget) return Promise.resolve(); // already pass the token checked

      let mysqlForm = {
        accordancesList: [[userId]]
      },
        conditionUser = {
          table: "verifications",
          cols: ["id_user", "password"],
          where: ["id_user"]
        };
      return _select_Basic(conditionUser, mysqlForm.accordancesList)
        .then((rows) => {
          if (rows.length > 0) {
            return bcrypt.compare(req.body.password_old, rows[0].password).then(isMatch => {
              //bcrypt genSalt and hash new password, then Sequelize update to verifications
              if (isMatch) {
                return; //compare success, go to hash
              }
              else {
                throw new authorizedError({ "password_old": "inputed password was wrong." }, 32)
              }
            })
          } else {
            throw new notFoundError({ "log": "no such user though with valid token in account/password.js" }, 144)
          }
        })
        .catch((error)=>{throw error});
    };

    oldPassCompare()
    .then(()=>{
      return new Promise((resolveBcrypt, rejectBcrypt) => {
        bcrypt.genSalt(10, (err, salt) => {
          if (err) return Promise.reject(new internalError('bcrypt.genSalt error in account/password.js', 131));
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) return Promise.reject(new internalError('bcrypt.hash error in account/password.js', 131));
            resolveBcrypt(hash);
          })
        });
      }).then((hash) => {
        //it's bad to use 'findOne' before update, the result instance is not proper here
        return _DB_verifications.update(
          { password: hash },
          { where: { id_user: userId } }
        )
      })
      .catch((err)=>{
        throw err
      });

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
