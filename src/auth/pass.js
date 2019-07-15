const express = require('express');
const pass = express.Router();
const jwt = require('jsonwebtoken');
const winston = require('../../config/winston.js');
const {verify_key} = require('../../config/jwt.js');
const {
  _handle_ErrCatched,
  authorizedError,
} = require('../utils/reserrHandler.js');

//verify token here, for any not login or register request
pass.use(function(req, res, next) {
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: auth/pass check ');

  let token = req.body.token || req.headers['token'] || req.query.token;
  let resData = {};
  if (token) {
    jwt.verify(token, verify_key, function(err) {
      if (err) {
        _handle_ErrCatched(new authorizedError("unauthorize throw by pass.js, "+err, 32), req, res);
      } else {
        next();
      }
    });
  } else {
    resData['error'] = 1;
    resData['message'] = 'Please send a token';
    res.status(403).json(resData);
  }
});

module.exports = pass;
