const express = require('express');
const main = express.Router();
const winston = require('../../config/winston.js');
const {
  _handle_ErrCatched,
  authorizedError,
} = require('../utils/reserrHandler.js');

const invitationExcutive = require('./invitation.js');
const basicExcutive = require('./basic.js');

/*
  Notice! Check First!
*/
main.use(function (req, res, next) {
    if (process.env.NODE_ENV == 'development') winston.verbose('middleware: permission check at path /general. ');

    let tokenify = req.extra.tokenify;
    //deal the situation if the token did not pass the check in last step
    if(!tokenify){
      let pathSplice = req.path.match(/\/(.*?)\//); //would always return the '1st' of '/.../', and now the .path() would be path 'after' /general/
      /*
      ref:
      stackoverflow: https://stackoverflow.com/questions/5642315/regular-expression-to-get-a-string-between-two-strings-in-javascript/40782646
      RegExp.exec(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec
      */
      const noTokenHandler = () => {
        let message = `res code 401: missing token if you want to req this resource, to route "${req.originalUrl}".`;
        _handle_ErrCatched(new authorizedError(message, 89), req, res);
      };
      switch (pathSplice[1]) { //pathSplice should be e.g "[/invitation/,invitation, ...]"
        case 'invitation':
          next();
          break;
        case 'basic':
          next();
          break;
        default:
          noTokenHandler()
      };
    }
    //or if there is token, we just go next
    else next();
})

//middleware not need token
main.use('/invitation', invitationExcutive)

main.use('/basic', basicExcutive)

//then other middleware after the permission check


module.exports = main;
