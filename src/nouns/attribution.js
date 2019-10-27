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

function _set_contributorsList(selectResult) {
  let sendingData = {
    temp: {},
    usersListPlain: []
  };

  selectResult.forEach((row, index)=>{
    if(sendingData.usersListPlain.includes(row.id_author)) return;
    sendingData.usersListPlain.push(row.id_author);
  });

  return sendingData;
}

function _set_sharedCount(selectResult) {
  let sendingData = {
    temp: {},
    count: selectResult.count //go straight, the amount of rows of this node is same as the amount the Units used it
  };

  return sendingData;
}


function _handle_GET_nouns_attribution(req, res){
  new Promise((resolve, reject)=>{
    const reqToken = req.body.token || req.headers['token'] || req.query.token;
    const jwtVerified = jwt.verify(reqToken, verify_key);
    if (!jwtVerified) throw new authorizedError("during GET--/nouns/attribution, "+jwtVerified, 32);

    return _DB_attribution.findAndCountAll({
      where: {id_noun: req.reqNounId}
    }).then((results)=>{
      let sendingData = {};

      //please remembering we are using the findAndCountAll method, so call the 'rows' after results

      switch (req.query.require) {
        case 'contributors':
          sendingData = _set_contributorsList(results.rows);
          break;
        case 'countShared':
          sendingData = _set_sharedCount(results); //Notice ! for convinence, we send whole results here, including both .row & .count
          break;
        default:
          sendingData = _set_contributorsList(results.rows);
      };

      resolve(sendingData);
    }).catch((err)=>{
      reject(new internalError(err, 131));
    });
  }).then((sendingData)=>{
    _res_success(res, sendingData, "GET: /nouns/attribution, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}


execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /nouns/attribution ');
  _handle_GET_nouns_attribution(req, res);
})

module.exports = execute;
