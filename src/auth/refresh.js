const express = require('express');
const refresh = express.Router();
const jwt = require('jsonwebtoken');
const signAccess = require('./jwt/tokenAccess.js');
const signRefresh = require('./jwt/tokenRefresh.js');
const {verify_key_refresh} = require('../../config/jwt.js');
const winston = require('../../config/winston.js');
const {
  _handle_ErrCatched,
  authorizedError,
  validationError,
  internalError
} = require('../utils/reserrHandler.js');

//verify token here, for any not login or register request
refresh.use(function(req, res, next) {
  if(process.env.NODE_ENV == 'development') winston.verbose('POST: auth/refresh ');

  let tokenRefresh = req.body.tokenRefresh || req.headers['tokenRefresh'] || req.query.tokenRefresh;
  let resData = {};

  if (tokenRefresh) {
    jwt.verify(tokenRefresh, verify_key_refresh, function(err, payload) {
      if (err) {
        _handle_ErrCatched(new authorizedError("unauthorized refresh token, "+err, 32), req, res);
      } else {
        let payloadNew = {
          user_Id: payload.user_Id,
          user_Role: 'public'
        }
        Promise.all([
          signAccess(Object.assign({},  payloadNew, {token_: 'access'})), //current payload also has 'token_'
          signRefresh(Object.assign({}, payloadNew, {token_: 'refresh'})) //so overlap it
        ]).then((arrResults)=>{
          //res both access token & refresh token
          resData['token'] = arrResults[0];
          resData['tokenRefresh'] = arrResults[1];
          resData['error'] = 0;
          resData['message'] = 'token refresh!';
          res.status(200).json(resData);
        }).catch((error)=>{
          _handle_ErrCatched(error, req, res);
        });
      }
    });
  } else {
    _handle_ErrCatched(new validationError('please sign in again.', 215), req, res);
  }
});

module.exports = refresh;
