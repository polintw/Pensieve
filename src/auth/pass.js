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
    jwt.verify(token, verify_key, function(err, decoded) {
      if (err) {
        _handle_ErrCatched(new authorizedError("unauthorize throw by pass.js, "+err, 32), req, res);
      } else {
        //set the decoded general info into req
        //in case there were not an established 'extra' obj in req
        if(!!req['extra']) req['extra']['tokenUserId']= decoded.user_Id
        else{
          req['extra'] = {tokenUserId: decoded.user_Id};
        };

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
