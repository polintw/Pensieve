const express = require('express');
const refresh = express.Router();
const jwt = require('jsonwebtoken');
const signAccess = require('./jwt/tokenAccess.js');
const signRefresh = require('./jwt/tokenRefresh.js');
const {verify_key_refresh} = require('../../config/jwt.js');
const {
  _handle_ErrCatched,
  authorizedError,
  validationError,
  internalError
} = require('../utils/reserrHandler.js');

//verify token here, for any not login or register request
refresh.use(function(req, res, next) {
  let refreshToken = req.body.refreshToken || req.headers['refreshToken'] || req.query.refreshToken;
  let resData = {};
  if (token) {
    jwt.verify(refreshToken, verify_key_refresh, function(err, payload) {
      if (err) {
        _handle_ErrCatched(new authorizedError("unauthorized refresh token, "+err, 32), req, res);
      } else {
        Promise.all([
          signAccess(Object.assign({},  payload, {token_: 'access'})), //current payload also has 'token_'
          signRefresh(Object.assign({}, payload, {token_: 'refresh'})) //so overlap it
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
    _handle_ErrCatched(new validationError('warning: no token was sent.', 215), req, res);
  }
});

module.exports = refresh;
