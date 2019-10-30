const express = require('express');
const status = express.Router();
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../config/jwt.js');
const {
  _select_Basic
} = require('../utils/dbSelectHandler.js');
const {
  internalError,
  authorizedError,
  _handle_ErrCatched,
  _handler_err_NotFound,
  _handler_err_BadReq,
  _handler_err_Unauthorized,
  _handler_err_Internal
} = require('../utils/reserrHandler.js');

//verify token here, for any not login or register request
status.use(function(req, res) {
  let token = req.body.token || req.headers['token'] || req.query.token;
  let resData = {};
  if (token) {
    jwt.verify(token, verify_key, function(err, payload) {
      if (err) {
        _handle_ErrCatched(new authorizedError("invalid token detect at /stattus, "+err, 32), req, res);
      } else {
        let userId = payload.user_Id;
        let mysqlForm = {
          accordancesList: [[userId]]
        },
        conditionUser = {
          table: "users",
          cols: ["id", "account", "first_name", 'last_name'],
          where: ["id"]
        };
        _select_Basic(conditionUser, mysqlForm.accordancesList).then((results)=>{
          if(results.length < 1){throw {status: 500, err: 'no this user in DB'}};
          let userInfo = results[0];
          resData.error = 0;
          resData['message'] = "this is a valid token";
          resData['userInfo'] = {
            account: userInfo.account,
            firstName: userInfo.first_name,
            lastName: userInfo.last_name,
            id: userInfo.id
          };
          res.status(200).json(resData);
        }).catch((errObj)=>{
          console.log("error occured during: auth/status promise: "+errObj.err)
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
      }
    });
  } else {
    resData['error'] = 1;
    resData['message'] = 'Please send a token';
    res.status(403).json(resData);
  }
});

module.exports = status;
