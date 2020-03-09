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
    let pathSplice = req.path.match(/\/(.*?)\//); //would always return the '1st' of '/.../'
    /*
    ref:
    stackoverflow: https://stackoverflow.com/questions/5642315/regular-expression-to-get-a-string-between-two-strings-in-javascript/40782646
    RegExp.exec(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec
    */
    switch (pathSplice[1]) { //[1] to the 'match obj', was the match substring (part between the parenthesis in rex.)
      case 'img':
        // let /img/ pass even without a token.
        next()
        break;
      default:
        let message = `res code 401: missing token caught by /pass, to route "${req.originalUrl}".`;
        _handle_ErrCatched(new authorizedError(message, 89), req, res);
    };
  }
});

module.exports = pass;
