const express = require('express');
const status = express.Router();
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../config/jwt.js');
const winston = require('../../config/winston.js');
const _DB_users = require('../../db/models/index').users;
const _DB_paths = require('../../db/models/index').paths;
const _DB_usersPaths = require('../../db/models/index').users_paths;
const {
  internalError,
  authorizedError,
  notFoundError,
  _handle_ErrCatched,
} = require('../utils/reserrHandler.js');
const {
  _res_success
} = require('../utils/resHandler.js');

//verify token here, for any not login or register request
status.use(function(req, res) {
  if(process.env.NODE_ENV == 'development') winston.verbose(`GET: auth/status check, for ${req.originalUrl}.`);

  let token = req.body.token || req.headers['token'] || req.query.token;
  let resData = {};

  if(!token){ // no token passed
    let message = `res code 401: missing token caught by /status, to route "${req.originalUrl}".`;
    _handle_ErrCatched(new authorizedError(message, 89), req, res);
    return; // return to stop
  }
  // claim an async function
  async function statusVerified(err, payload){
    if (err) {
      _handle_ErrCatched(new authorizedError("invalid token detect at /stattus, "+err, 32), req, res);
    } else {
      try{
        let userId = payload.user_Id;
        let userInfo = await _DB_users.findOne({
          where: {id: userId},
          attributes: ['id', 'account', 'first_name', 'last_name', 'status']
        });
        if(!userInfo){ //if the result was 'null'
          throw new notFoundError("no this user in DB.");
          return;
        };
        /*
        finally confirm a user with a valid token exist, go for valid response
        */
        let userPath = await _DB_usersPaths.findOne({
          where: {id_user: userId}
        }), pathInfo;
        if(!!userPath){ // there 'is' a pathProject
          pathInfo = await _DB_paths.findOne({
            where: {id: userPath.id_path}
          });
        };
        let sendingData={
          userInfo: {
            account: userInfo.account,
            accountStatus: userInfo.status,
            firstName: userInfo.first_name,
            lastName: userInfo.last_name,
            id: userInfo.id,
            pathProject: !!userPath ? pathInfo.name: null,
            pathName: !!userPath ? pathInfo.pathName : null
          },
          temp: {}
        };

        _res_success(res, sendingData, "this is a valid token.");

      }
      catch(error){
        _handle_ErrCatched(error, req, res);
        return;
      }
    };
  }

  jwt.verify(token, verify_key, statusVerified);
});

module.exports = status;
