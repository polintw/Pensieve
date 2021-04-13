const express = require('express');
const main = express.Router();
const winston = require('../../config/winston.js');
const {
  _handle_ErrCatched,
  authorizedError,
} = require('../utils/reserrHandler.js');

const srcExecutive = require('./single/src.js');
const singleExecutive = require('./single/single.js');
const relatedExecutive = require('./single/related.js')
const entitiesExecutive = require('./entities/execute.js')
const numerousExecutive = require('./numerous.js')
const primerExecutive = require('./primer.js')
const respondsExecutive = require('./responds.js')

/*
  Notice! Check First!
*/
main.use(function(req, res, next) {
  if(process.env.NODE_ENV == 'development') winston.verbose('middleware: permission check at path /units. ');

  let tokenify = req.extra.tokenify;
  //deal the situation if the token did not pass the check in last step
  if(!tokenify){
    let pathString = req.path + '/'; // to make a string match the beneath rex
    let pathSplice = pathString.match(/\/(.*?)\//); //would always return the '1st' of '/.../', and now the .path() would be path 'after' /units/
    let secondPath = !!pathSplice ? pathSplice[1] : 'noParamAfter' ; // the path do not has any param after /units would get a null in pathSplice
    /*
    ref:
    stackoverflow: https://stackoverflow.com/questions/5642315/regular-expression-to-get-a-string-between-two-strings-in-javascript/40782646
    RegExp.exec(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec
    */
    const noTokenHandler = ()=>{
      let message = `res code 401: missing token if you want to req this resource, to route "${req.originalUrl}".`;
      _handle_ErrCatched(new authorizedError(message, 89), req, res);
    }
    switch (secondPath) { //pathSplice should be e.g "[/numerous/,numerous, ...]"
      case 'primer':
        noTokenHandler();
        break;
      case 'responds':
        noTokenHandler();
        break;
      default:
        next()
    }
  }
  //or if there is token, we just go next
  else next();
})

//then other middleware after the permission check

// path has token
main.use('/primer', primerExecutive)
main.use('/responds', respondsExecutive)


// path do not need a token

main.use('/numerous', numerousExecutive)
main.use('/entity', entitiesExecutive)
// remember put the pathe with ':id' after the others.
main.param("exposedId", (req, res, next, exposedId)=>{
  req.reqExposedId = exposedId;
  next();
})
main.use('/:exposedId/related', relatedExecutive)
main.use('/:exposedId/src', srcExecutive)
main.use('/:exposedId', singleExecutive)

module.exports = main;
