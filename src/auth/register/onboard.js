const express = require('express');
const execute = express.Router();
const jwt = require('jsonwebtoken');
const winston = require('../../../config/winston.js');
const _DB_users = require('../../../db/models/index').users;
const _DB_users_apply = require('../../../db/models/index').users_apply;
const {_res_success} = require('../../utils/resHandler.js');
const {
  verify_key,
} = require('../../../config/jwt.js');
const {
  _handle_ErrCatched,
  internalError,
  notFoundError,
  authorizedError,
  validationError
} = require('../../utils/reserrHandler.js');

async function _handle_PATCH_userStatusOnBoard(req, res){
  let userId = '';

  // this is a special api needed token but unser /register, so decoded token locally
  const token = req.body.token || req.headers['token'];

  if (token) {
    const keyUsed = verify_key ;
    const decoded = await jwt.verify(token, keyUsed);
    if(!decoded) { _handle_ErrCatched(new authorizedError("unauthorize throw by onboard.js, "+decoded, 32), req, res); return; /* not allowed, close the f()*/};
    userId = decoded.user_Id;

  } else {
    let message = `res code 401: missing token caught by /onboard, to route "${req.originalUrl}".`;
    _handle_ErrCatched(new authorizedError(message, 89), req, res);
    return; /* not allowed, close the f()*/
  }

  try{
    const userRow = await _DB_users.findOne({
      where: { id: userId }
    });
    if(!userRow){ //means the result is 'null'
      throw new notFoundError({warning: "You request an invalid account."},34);
    };
    if(userRow.status != 'newly'){ // only update the new user
      throw new validationError({warning: "Your account had already activated. Try to refresh the page to start browsing."},15);
    };
    // if passed, update the user's status to 'active'
    await _DB_users.update(
      { status: "active" },
      {
        where: {
          id: userId
        }
      }
    );
    await _DB_users_apply.update(
      { status: "active" },
      {
        where: {
          id_user: userId
        }
      }
    );

    let sendingData={ //nothing need to be returned
      temp: {}
    };
    _res_success(res, sendingData, "PATCH: register, /onboard, complete.");
  }
  catch(error){
    _handle_ErrCatched(error, req, res);
  }
}

module.exports = _handle_PATCH_userStatusOnBoard;
