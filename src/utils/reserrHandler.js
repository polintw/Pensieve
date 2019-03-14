const winston = require('../../config/winston.js');

function _handler_err_BadReq(err, res){
  let resData = {};
  resData['error'] = 1;
  resData['message'] = 'Unvalid request!';
  console.log('BadReq Error: '+err);
  res.status(400).json(resData);
 }

function _handler_err_Unauthorized(err, res){
  let resData = {};
  resData['error'] = 1;
  resData['message'] = "Token is invalid";
  res.status(401).json(resData);
}

function _handler_err_NotFound(err, res){
  console.log("resHandler: not found, "+ err)
  let resData = {};
  resData['error'] = 1;
  resData['message'] = err.length>0? err : 'Page not found!';
  res.status(404).json(resData);
}

function _handler_err_Internal(err, res){
  let resData = {};
  resData['error'] = 1;
  resData['message'] = 'Error Occured: Internal Server Error';
  res.status(500).json(resData);
}

function _handler_ErrorRes(errSet, res){
  let resData = {
    "code": errSet.code?errSet.code:"",
    "message": errSet.message,
    "console": errSet.console
  };
  res.status(errSet.status).json(resData);
}


class validationError extends Error {
  constructor(message, code) {
    super(message);
    this.status = 400;
    this.code = code;
    this.message = message;
  }
}

class authorizedError extends Error {
  constructor(message, code) {
    super(message);
    this.status = 401;
    this.code = code;
    this.message = message;
  }
}

class forbbidenError extends Error {
  constructor(message, code) {
    super(message);
    this.status = 403;
    this.code = code;
    this.message = message;
  }
}

class notFoundError extends Error {
  constructor(message, code) {
    super(message);
    this.status = 404;
    this.code = code;
    this.message = message;
  }
}

class notAcceptable extends Error {
  constructor(message, code) {
    super(message);
    this.status = 406;
    this.code = code;
    this.message = message;
  }
}

class tooManyReqError extends Error {
  constructor(message, code) {
    super(message);
    this.status = 429;
    this.code = code;
    this.message = message;
  }
}

class internalError extends Error {
  constructor(message, code) {
    super(message);
    this.status = 500;
    this.code = code;
    this.message = message;
  }
}

function _handle_ErrCatched(e, req, res){
  let clientSet = Object.assign({}, {
    "code": "",
    "message": "",
    "console": ""
  });

  switch (e.code) {
    case 32:
      //401, token invalid, authorized failed
      clientSet['code'] = 32;
      clientSet['message'] = "error: could not authenticate you";
      clientSet['console'] = '';
      return res.status(e.status).json(clientSet);
      break;
    case 33:
      clientSet['code'] = 33;
      clientSet['message'] = e.message;
      clientSet['console'] = '';
      return res.status(e.status).json(clientSet);
      break;
    case 50:
      clientSet['code'] = 50;
      clientSet['message'] = e.message;
      clientSet['console'] = '';
      return res.status(e.status).json(clientSet);
      break;
    case 87:
      clientSet['code'] = 87;
      clientSet['message'] = e.message;
      clientSet['console'] = '';
      return res.status(e.status).json(clientSet);
      break;
    case 120:
      //currently used by sharedsPOST, when there is no noun accompany
      clientSet['code'] = 120;
      clientSet['message'] = e.message;
      clientSet['console'] = '';
      return res.status(e.status).json(clientSet);
      break;
    case 131:
      //500, unexpected internal error
      winston.error(`${e.status} - ${"Error: code 131, "+e.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
      clientSet['code'] = 131;
      clientSet['message'] = {"warning":"Some error happened, please try again."};
      clientSet['console'] = '';
      return res.status(e.status).json(clientSet);
      break;
    case 144:
      winston.warn(`${e.status} - ${"Error: code 144, "+e.message["log"]} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
      clientSet['code'] = "144";
      clientSet['message'] ={"warning":"User not found, perhaps the account had been deleted."};
      clientSet['console'] = '';
      return res.status(e.status).json(clientSet);
      break;
    case 186:
      //invalid format from register or mail resend
      clientSet['code'] = 186;
      clientSet['message'] = e.message;
      clientSet['console'] = '';
      return res.status(e.status).json(clientSet);
      break;
    default:
      winston.error(`${500} - ${e} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
      return res.status(500).json({
        "message": {"warning":"Some error happened, please try again."},
        'console': ''
      });
  }
}

module.exports= {
  validationError,
  authorizedError,
  forbbidenError,
  notFoundError,
  tooManyReqError,
  internalError,
  _handle_ErrCatched,
  _handler_ErrorRes,
  _handler_err_BadReq,
  _handler_err_NotFound,
  _handler_err_Unauthorized,
  _handler_err_Internal
}
