const express = require('express');
const execute = express.Router();
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../config/jwt.js');
const winston = require('../../config/winston.js');
const Sequelize = require('sequelize');
const _DB_users = require('../../db/models/index').users;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
  authorizedError,
  forbbidenError
} = require('../utils/reserrHandler.js');

function _handle_GET_users_explore(req, res){
  new Promise((resolve, reject)=>{
    const reqToken = req.body.token || req.headers['token'] || req.query.token;
    const jwtVerified = jwt.verify(reqToken, verify_key);
    if (!jwtVerified) throw new authorizedError("during GET--/explore/users, "+jwtVerified, 32);

    //select users whose status is 'active'
    return _DB_users.findAndCountAll({
      attributes: ['id']
    }).then((result)=>{
      let sendingData = {
        temp: {},
        usersListPlain: []
      };

      result.rows.forEach((row, index)=>{
        sendingData.usersListPlain.push(row.id);
      })

      resolve(sendingData);
    }).catch((err)=>{
      reject(new internalError(err, 131));
    });
  }).then((sendingData)=>{
    _res_success(res, sendingData, "GET: /explore/users, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}


execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /explore/users ');
  _handle_GET_users_explore(req, res);
})

module.exports = execute;
