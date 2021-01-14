const express = require('express');
const main = express.Router();
const winston = require('../../config/winston.js');
const {
  _handle_ErrCatched,
  authorizedError,
} = require('../utils/reserrHandler.js');

const basicExcutive = require('./basic.js');
const countExecutive = require('./count/execute.js');
const searchExecutive = require('./search/execute.js');
const directExecutive = require('./direct.js');
const layerExcutive = require('./layer.js');
const listExecutive = require('./list.js');
const accumulatedExecutive = require('./accumulated.js');
const attributeExecutive = require('./attribution.js');

/*
  Notice! Check First!
*/
main.use(function(req, res, next) {
  if(process.env.NODE_ENV == 'development') winston.verbose('middleware: permission check at path /nouns. ');

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
    };
    switch (secondPath) { //pathSplice should be e.g "[/numerous/,numerous, ...]"
      case 'layer':
        next();
        break;
      case 'basic':
        next();
        break;
      default:
        noTokenHandler();
    }
  }
  //or if there is token, we just go next
  else next();
})

//then other middleware after the permission check
// path do not need a token
main.use('/layer', layerExcutive)

main.use('/list', listExecutive)

main.use('/basic', basicExcutive)

// path need a token
main.use('/search', searchExecutive)

main.use('/direct', directExecutive)

main.use('/accumulated', accumulatedExecutive)

main.param("id", (req, res, next, id)=>{
  req.reqNounId = id;
  next();
})

main.use('/:id/attribution', attributeExecutive)

main.use('/:id/count', countExecutive)


module.exports = main;
