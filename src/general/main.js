const express = require('express');
const main = express.Router();

const usersExcutive = require('./users.js');

/*
  Notice! Check First!
*/
main.use(function (req, res, next) {
    if (process.env.NODE_ENV == 'development') winston.verbose('middleware: permission check at path /general. ');

    let tokenify = req.extra.tokenify;
    let pathSplice = req.path.match(/\/(.*?)\//); //would always return the '1st' of '/.../'
    /*
    ref:
    stackoverflow: https://stackoverflow.com/questions/5642315/regular-expression-to-get-a-string-between-two-strings-in-javascript/40782646
    RegExp.exec(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec
    */
    const noTokenHandler = () => {
        let message = `res code 401: missing token if you want to req this resource, to route "${req.originalUrl}".`;
        _handle_ErrCatched(new authorizedError(message, 89), req, res);
    }
    switch (pathSplice) {
        case 'invitation':
            next();
            break;
        default:
            noTokenHandler()
    }
})

//then other middleware after the permission check

main.use('/users', usersExcutive)

module.exports = main;
