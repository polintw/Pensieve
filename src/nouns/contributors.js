const express = require('express');
const execute = express.Router();
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../config/jwt.js');
const winston = require('../../config/winston.js');
const Sequelize = require('sequelize');
const _DB_users = require('../../db/models/index').users;
const _DB_attribution = require('../../db/models/index').attribution;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
  authorizedError,
  forbbidenError
} = require('../utils/reserrHandler.js');

function _handle_GET_nouns_contributors(req, res){
  new Promise((resolve, reject)=>{
    const reqToken = req.body.token || req.headers['token'] || req.query.token;
    const jwtVerified = jwt.verify(reqToken, verify_key);
    if (!jwtVerified) throw new authorizedError("during GET--/nouns/contributors, "+jwtVerified, 32);

    return _DB_attribution.findAll({
      where: {id_noun: req.reqNounId},
      attributes: ['id_author']
    }).then((results)=>{
      let sendingData = {
        temp: {},
        usersListPlain: []
      };

      results.forEach((row, index)=>{
        if(sendingData.usersListPlain.includes(row.id_author)) return;
        sendingData.usersListPlain.push(row.id_author);
      })

      resolve(sendingData);
    }).catch((err)=>{
      reject(new internalError(err, 131));
    });
  }).then((sendingData)=>{
    _res_success(res, sendingData, "GET: /nouns/contributors, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}


execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /nouns/contributors ');
  _handle_GET_nouns_contributors(req, res);
})

module.exports = execute;
