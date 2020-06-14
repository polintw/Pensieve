const express = require('express');
const status = express.Router();
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../config/jwt.js');
const winston = require('../../config/winston.js');
const _DB_users = require('../../db/models/index').users;
const {
  internalError,
  authorizedError,
  notFoundError,
  _handle_ErrCatched,
} = require('../utils/reserrHandler.js');
const {
  _res_success
} = require('../utils/resHandler.js');

//verify token here, for any not login or register request
status.use(function(req, res) {
  if(process.env.NODE_ENV == 'development') winston.verbose(`GET: auth/status check, for ${req.originalUrl}.`);

  let token = req.body.token || req.headers['token'] || req.query.token;
  let resData = {};
  if (token) {
    jwt.verify(token, verify_key, function(err, payload) {
      if (err) {
        _handle_ErrCatched(new authorizedError("invalid token detect at /stattus, "+err, 32), req, res);
      } else {
        let userId = payload.user_Id;

        _DB_users.findOne({
          where: {id: userId},
          attributes: ['id', 'account', 'first_name', 'last_name', 'status']
        })
        .then((result)=>{
          if(!result) throw new notFoundError("no this user in DB.") //if the result was 'null'
          else {
            let sendingData={
              userInfo: {
                account: result.account,
                accountStatus: result.status,
                firstName: result.first_name,
                lastName: result.last_name,
                id: result.id,
              },
              temp: {}
            };

            return sendingData;
          }

        })
        .then((sendingData)=>{
          _res_success(res, sendingData, "this is a valid token.");
        })
        .catch((error)=>{
          _handle_ErrCatched(error, req, res);
        });
      }
    });
  } else {
    let message = `res code 401: missing token caught by /status, to route "${req.originalUrl}".`;

    _handle_ErrCatched(new authorizedError(message, 89), req, res);
  }
});

module.exports = status;
