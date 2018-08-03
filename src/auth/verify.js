const express = require('express');
const verify = express.Router();
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../config/jwt.js');

//verify token here, for any not login or register request
verify.use(function(req, res, next) {
  console.log('verify token')
  let token = req.body.token || req.headers['token'] || req.query.token;
  let resData = {};
  if (token) {
    jwt.verify(token, verify_key, function(err) {
      if (err) {
        resData['error'] = 1;
        resData['data'] = "Token is invalid";
        res.status(500).json(resData);
      } else {
        next();
      }
    });
  } else {
    resData['error'] = 1;
    resData['data'] = 'Please send a token';
    res.status(403).json(resData);
  }
});

module.exports = verify;
