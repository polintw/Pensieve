const express = require('express');
const pass = express.Router();
const jwt = require('jsonwebtoken');
const winston = require('../../config/winston.js');
const {
  verify_key,
  verify_forget
} = require('../../config/jwt.js');
const {
  _handle_ErrCatched,
  authorizedError,
} = require('../utils/reserrHandler.js');

//verify token here, for any not login or register request
pass.use(function(req, res, next) {
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: auth/pass check ');

  let token = req.body.token || req.headers['token'] || req.query.token;
  // Notice ! value in headers would be always set to type 'string',

  if (
    !!token &&
    token != 'undefined' // in case the app do pass a token prop but only a 'undefined'
  ) {
    /*There is a special api: /account/password?forget */
    let keyUsed = !!req.query.forget ? verify_forget : verify_key ;

    jwt.verify(token, keyUsed, function(err, decoded) {
      if (err) {
        _handle_ErrCatched(new authorizedError("unauthorize throw by pass.js, "+err, 32), req, res);
      } else {
        //set the decoded general info into req
        //in case there were not an established 'extra' obj in req
        if(!!req['extra']){
          req['extra']['tokenUserId']= decoded.user_Id;
          req['extra']['tokenify']= true;
        }
        else{
          req['extra'] = {
            tokenUserId: decoded.user_Id,
            tokenify: true
          };
        };

        next();
      }
    });
  } else {
    // we set 'tokenify' as a mark after the permission check
    if(!!req['extra']){
      req['extra']['tokenify']= false;
    }
    else{
      req['extra'] = {
        tokenify: false
      };
    };
    //And now, some path are allowed passeing even without token (let the middleware judge themselves)
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
      case 'units':
        // let /units/ pass, check the 'tokenify' itself.
        next()
        break;
      case 'nouns':
        // let /nouns/ pass, check the 'tokenify' itself.
        next()
        break;
      case 'paths':
        // let /paths/ pass, check the 'tokenify' itself.
        next()
        break;
      case 'general':
        // let /general/ pass, check the 'tokenify' itself.
        next()
        break;
      default:
        let message = `res code 401: missing token caught by /pass, to route "${req.originalUrl}".`;
        _handle_ErrCatched(new authorizedError(message, 89), req, res);
    };
  }
});

module.exports = pass;
