exports._handler_err_BadReq = function(err, res){
  let resData = {};
  resData['error'] = 1;
  resData['message'] = 'Unvalid request!';
  console.log('BadReq Error: '+err);
  res.status(400).json(resData);
 }

exports._handler_err_Unauthorized = function(err, res){
  let resData = {};
  resData['error'] = 1;
  resData['message'] = "Token is invalid";
  res.status(401).json(resData);
}

exports._handler_err_NotFound = function(err, res){
  console.log("resHandler: not found, "+ err)
  let resData = {};
  resData['error'] = 1;
  resData['message'] = err.length>0? err : 'Page not found!';
  res.status(404).json(resData);
}

exports._handler_err_Internal = function(err, res){
  let resData = {};
  resData['error'] = 1;
  resData['message'] = 'Error Occured: Internal Server Error';
  res.status(500).json(resData);
}

exports._handler_ErrorRes = function(errSet, res){
  let resData = {
    "message": errSet.message,
    "console": errSet.console
  };
  res.status(errSet.status).json(resData);
}


export class validationError extends Error {
  constructor(message, code) {
    super(message);
    this.status = 400;
    this.code = code;
  }
}

export class authorizedError extends Error {
  constructor(message, code) {
    super(message);
    this.status = 401;
    this.code = code;
  }
}

export class forbbidenError extends Error {
  constructor(message, code) {
    super(message);
    this.status = 403;
    this.code = code;
  }
}

export class notFoundError extends Error {
  constructor(message, code) {
    super(message);
    this.status = 404;
    this.code = code;
  }
}

export class tooManyReqError extends Error {
  constructor(message, code) {
    super(message);
    this.status = 429;
    this.code = code;
  }
}

export class internalError extends Error {
  constructor(message, code) {
    super(message);
    this.status = 500;
    this.code = code;
  }
}

exports._handle_ErrCatched = function(e){
  let clientSet = Object.assign({}, {
    "code": "",
    "message": "",
    "console": ""
  });

  switch (e.code) {
    case 32:
      clientSet['code'] = 32;
      clientSet['message'] = e.message;
      clientSet['console'] = '';
      return res.status(e.status).json(e.clientSet);
      break;
    case 50:
      console.log("Error: code 50, "+e.message.log);
      clientSet['code'] = 50;
      clientSet['message'] ={"warning":"User not found."};
      clientSet['console'] = '';
      return res.status(e.status).json(e.clientSet);
      break;
    case 131:
      console.log("Error: code 131, "+e.message)
      clientSet['code'] = 131;
      clientSet['message'] = {"warning":"Some error happened, please try again."};
      clientSet['console'] = '';
      return res.status(e.status).json(e.clientSet);
      break;
    case 186:
      clientSet['code'] = 186;
      clientSet['message'] = e.message;
      clientSet['console'] = '';
      return res.status(e.status).json(e.clientSet);
      break;
    default:
      console.log(e);
      return res.status(500).json({"message": {"warning":"Some error happened, please try again."}});
  }
}
