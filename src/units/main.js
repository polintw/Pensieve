const express = require('express');
const main = express.Router();
const winston = require('../../config/winston.js');
const {
  _handle_ErrCatched,
  authorizedError,
} = require('../utils/reserrHandler.js');

const srcExecutive = require('./single/src.js');
const singleExecutive = require('./single/single.js');
const numerousExecutive = require('./numerous.js')
const primerExecutive = require('./primer.js')

/*
  Notice! Check First!
*/
main.use(function(req, res, next) {
  if(process.env.NODE_ENV == 'development') winston.verbose('middleware: permission check at path /units. ');

  let tokenify = req.extra.tokenify;
  let pathSplice = req.path.match(/\/(.*?)\//); //would always return the '1st' of '/.../'
  /*
  ref:
  stackoverflow: https://stackoverflow.com/questions/5642315/regular-expression-to-get-a-string-between-two-strings-in-javascript/40782646
  RegExp.exec(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec
  */
  const noTokenHandler = ()=>{
    let message = `res code 401: missing token if you want to req this resource, to route "${req.originalUrl}".`;
    _handle_ErrCatched(new authorizedError(message, 89), req, res);
  }
  switch (pathSplice) {
    case 'numerous':
      tokenify ? next() : noTokenHandler();
      break;
    case 'primer':
      tokenify ? next() : noTokenHandler();
      break;
    default:
      next()
  }
})

//then other middleware after the permission check

main.use('/numerous', numerousExecutive)
main.use('/primer', primerExecutive)

// remember put the pathe with ':id' after the others.
main.param("exposedId", (req, res, next, exposedId)=>{
  req.reqExposedId = exposedId;
  next();
})
main.use('/:exposedId/src', srcExecutive)
main.use('/:exposedId', singleExecutive)

module.exports = main;
