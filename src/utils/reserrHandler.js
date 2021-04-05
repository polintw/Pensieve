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
    case 7:
      //400, validation, invalid marks in posted shared
      clientSet['code'] = 7;
      clientSet['message'] = e.message;
      clientSet['console'] = '';
      return res.status(e.status).json(clientSet);
      break;
    case 15:
      //400, validation, invalid format for data going to DB, whatever the api is
      clientSet['code'] = 15;
      clientSet['message'] = e.message;
      clientSet['console'] = '';
      return res.status(e.status).json(clientSet);
      break;
    case 32:
      //401, token invalid, authorized failed
      clientSet['code'] = 32;
      clientSet['message'] = "Invalid authorization. Sign in again or sign up for more the wonderful world!";
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
    case 36: //403, You cannot inspired your own Contribution
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
    case 39: //403, client trying to edit/erase/get statics unit not released by him
      winston.warn(`${e.status} - ${"Error: code 39, "+e.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
      clientSet['code'] = 39;
      clientSet['message'] = "Hey! This is not your Shared! You can and only can edit, erase, or request statics for your own Shared.";
      clientSet['console'] = {};
      return res.status(e.status).json(clientSet);
      break;
    case 50: //404, user was not found
      clientSet['code'] = 50;
      clientSet['message'] = e.message;
      clientSet['console'] = '';
      return res.status(e.status).json(clientSet);
      break;
    case 51: //404, Unit was not found
      winston.warn(`${e.status} - ${"Error: code 51, req a Unit probably with an invalid id, "+e.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
      clientSet['code'] = 51;
      clientSet['message'] = e.message;
      clientSet['console'] = '';
      return res.status(e.status).json(clientSet);
      break;
    case 52: //404, PathProject was not found
      winston.warn(`${"error status: "+ e.status} - ${" ,code 52, req a Path probably with an invalid pathName, "+e.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
      clientSet['code'] = 52;
      clientSet['message'] = e.message;
      clientSet['console'] = '';
      return res.status(e.status).json(clientSet);
      break;
    case 53: //404, SubCate under PathProject was not found
      winston.warn(`${"error status: "+ e.status} - ${" ,code 53, req an invalid sub-category under PathProject, "+e.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
      clientSet['code'] = 53;
      clientSet['message'] = e.message;
      clientSet['console'] = '';
      return res.status(e.status).json(clientSet);
      break;
    case 71:
      //403,
      // currently used in patch /nodesBelong, change belongs too often
      winston.info(`${e.status} - ${" code 71, "+e.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
      clientSet['code'] = 71;
      clientSet['message'] = e.message;
      clientSet['console'] = '';
      return res.status(e.status).json(clientSet);
      break;
    case 73:
      //403,
      // currently used in patch /invitation/fellows, no belong had been set yet
      winston.warn(`${e.status} - ${" code 71, "+e.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
      clientSet['code'] = 73;
      clientSet['message'] = e.message;
      clientSet['console'] = '';
      return res.status(e.status).json(clientSet);
      break;
    case 77:
      //403,
      // currently used in patch account/password, change password too frequetly
      winston.info(`${e.status} - ${" code 77, "+e.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
      clientSet['code'] = 77;
      clientSet['message'] = e.message;
      clientSet['console'] = '';
      return res.status(e.status).json(clientSet);
      break;
    case 85:
      //403, user has verified, not allowed request again.
      winston.warn(`${e.status} - ${" code 85, "+e.message.warning} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
      clientSet['code'] = 85;
      clientSet['message'] = e.message;
      clientSet['console'] = '';
      return res.status(e.status).json(clientSet);
      break;
    case 87:
      //403, Client is not permitted to perform this action.
      winston.warn(`${e.status} - ${" code 87, "+e.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
      clientSet['code'] = 87;
      clientSet['message'] = "Hey, don't do this. This request is not allowed!";
      clientSet['console'] = '';
      return res.status(e.status).json(clientSet);
      break;
    case 89:
      //401, missing token.
      clientSet['code'] = 89;
      clientSet['message'] = "Please send a token.";
      clientSet['console'] = e.message;
      return res.status(e.status).json(clientSet);
      break;
    case 120:
      //403
      //currently used by sharedsPOST, when there is no noun accompany
      winston.warn(`${e.status} - ${"code 120, "+e.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
      clientSet['code'] = 120;
      clientSet['message'] = "You didn't submit with an allowed nodes";
      clientSet['console'] = '';
      return res.status(e.status).json(clientSet);
      break;
    case 123:
      //403,
      // used by sharedsPOST, in validation, the img data passed was not valid
      winston.info(`${e.status} - ${"code 123, "+e.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
      clientSet['code'] = 123;
      clientSet['message'] = e.message;
      clientSet['console'] = 'Hey! Use this api as required!';
      return res.status(e.status).json(clientSet);
      break;
    case 131:
      //500, unexpected internal error
      winston.error(`${"Res status: "+e.status} ; ${"Error code: 131, "+e.message} ; ${"Req: "+req.originalUrl} , ${req.method} , ${req.ip}`);
      clientSet['code'] = 131;
      clientSet['message'] = "Some error happened, please try again later.";
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
    case 150:
      //429, too many req for verified mail
      clientSet['code'] = 150;
      clientSet['message'] = e.message;
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
    case 325:
      //400, a exposedId do not match any Shared
      winston.warn(`${"Res status: "+e.status} ; ${"Error code: 325, "+e.message} ; ${"Req: "+req.originalUrl} , ${req.method} , ${req.ip}`);
      clientSet['code'] = 325;
      clientSet['message'] = "Shared you found was not exist.";
      clientSet['console'] = '';
      return res.status(e.status).json(clientSet);
      break;
    default:
      return _undefiendCode(e, req, res);
  }
}

function _undefiendCode(e, req, res){
  if(e.status == 404) return res.status(404).end() //actually, the error could have a res.status without e.code, not only 404
  else {
    winston.error(`${500} - ${e} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    return res.status(500).json({
      "message": "Some error happened, please try again.",
      'console': ''
    });
  };
};

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
