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
    case 3:
      //400, validation, nouns search format invalid
      clientSet['code'] = 3;
      clientSet['message'] = e.message;
      clientSet['console'] = '';
      return res.status(e.status).json(clientSet);
      break;
    case 32:
      //401, token invalid, authorized failed
      clientSet['code'] = 32;
      clientSet['message'] = "invalid authority. perhaps log in again or sign up for more function!";
      clientSet['console'] = '';
      return res.status(e.status).json(clientSet);
      break;
    case 33:
      clientSet['code'] = 33;
      clientSet['message'] = e.message;
      clientSet['console'] = '';
      return res.status(e.status).json(clientSet);
      break;
    case 34: //404, The specified resource was not found.
      winston.info(`${e.status} - ${"code 34, "+e.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
      clientSet['code'] = 34;
      clientSet['message'] = e.message;
      clientSet['console'] = '';
      return res.status(e.status).json(clientSet);
      break;
    case 36: //403, You cannot inspired your own mark
      winston.warn(`${e.status} - ${"Error: code 36, "+e.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
      clientSet['code'] = 36;
      clientSet['message'] = "Hey, don't do this, it would be more interesting inspired by others!";
      clientSet['console'] = '';
      return res.status(e.status).json(clientSet);
      break;
    case 37: //403, You cannot broadcast your own Shared
      winston.warn(`${e.status} - ${" code 37, "+e.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
      clientSet['code'] = 37;
      clientSet['message'] = "It's your own creation, let the people broadcast for you!";
      clientSet['console'] = '';
      return res.status(e.status).json(clientSet);
      break;
    case 38: //403, part of required parameter (such as id, media, text, etc.) is missing.
      winston.warn(`${e.status} - ${"Error: code 38, "+e.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
      clientSet['code'] = 38;
      clientSet['message'] = "";
      clientSet['console'] = {"warning":"Some parameter missed, please use correct format."};
      return res.status(e.status).json(clientSet);
      break;
    case 50:
      clientSet['code'] = 50;
      clientSet['message'] = e.message;
      clientSet['console'] = '';
      return res.status(e.status).json(clientSet);
      break;
    case 87: //403, Client is not permitted to perform this action.
      winston.warn(`${e.status} - ${" code 87, "+e.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
      clientSet['code'] = 87;
      clientSet['message'] = "Hey, don't do this. This request is not allowed!";
      clientSet['console'] = '';
      return res.status(e.status).json(clientSet);
      break;
    case 120:
      //403
      //currently used by sharedsPOST, when there is no noun accompany
      clientSet['code'] = 120;
      clientSet['message'] = e.message;
      clientSet['console'] = '';
      return res.status(e.status).json(clientSet);
      break;
    case 121:
      //403, process about wishlist of matchNodes fail, perhaps exceed length limit or some unknown submit
      clientSet['code'] = 121;
      clientSet['message'] = "";
      clientSet['console'] = '';
      return res.status(e.status).json(clientSet);
      break;
    case 131:
      //500, unexpected internal error
      winston.error(`${"Res status: "+e.status} ; ${"Error code: 131, "+e.message} ; ${"Req: "+req.originalUrl} , ${req.method} , ${req.ip}`);
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
      //403, invalid format from register or mail resend
      clientSet['code'] = 186;
      clientSet['message'] = e.message;
      clientSet['console'] = '';
      return res.status(e.status).json(clientSet);
      break;
    case 215:
      clientSet['code'] = 215;
      clientSet['message'] = e.message;
      clientSet['console'] = 'warning: no token was sent.';
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
