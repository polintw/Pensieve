const express = require('express');
const execute = express.Router();
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../config/jwt.js');
const winston = require('../../config/winston.js');
const Sequelize = require('sequelize');
const _DB_attribution = require('../../db/models/index').attribution;
const _DB_nouns = require('../../db/models/index').nouns;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
  authorizedError,
  forbbidenError
} = require('../utils/reserrHandler.js');

function _handle_GET_nouns_explore(req, res){
  new Promise((resolve, reject)=>{
    const reqToken = req.body.token || req.headers['token'] || req.query.token;
    const jwtVerified = jwt.verify(reqToken, verify_key);
    if (!jwtVerified) throw new authorizedError("during GET--/explore/nouns, "+jwtVerified, 32);

    //first, select nouns
    //for now we seperate the 'more', or RnadomList into another api
    //so we just select the nouns which have been used here
    return _DB_attribution.findAndCountAll({
      attributes: ['id_noun'],
      limit: 42
    }).then((result)=>{
      let sendingData = {
        temp: {},
        nounsListUsed: []
      };

      result.rows.forEach((row, index)=>{
        if(!sendingData.nounsListUsed.includes(row.id_noun)) sendingData.nounsListUsed.push(row.id_noun);
      })

      resolve(sendingData);
    }).catch((err)=>{
      reject(new internalError(err, 131));
    });
  }).then((sendingData)=>{
    _res_success(res, sendingData, "GET: /explore/nouns, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}


function _handle_GET_nouns_exploreMore(req, res){
  new Promise((resolve, reject)=>{
    const reqToken = req.body.token || req.headers['token'] || req.query.token;
    const jwtVerified = jwt.verify(reqToken, verify_key);
    if (!jwtVerified) throw new internalError(jwtVerified, 32);

    return _DB_nouns.findAndCountAll({
      order: [
        [Sequelize.fn('RAND')] //"RAND" is order for 'random' selection specific for mySQL
      ],
      attributes: ['id'],
      limit: 32
    }).then((nouns)=>{
      let sendingData = {
        temp: {},
        nounsListRandom: []
      };

      nouns.rows.forEach((row, index)=>{
        sendingData.nounsListRandom.push(row.id);
      })

      resolve(sendingData);
    }).catch((err)=>{
      reject(new internalError(err, 131));
    });
  }).then((sendingData)=>{
    _res_success(res, sendingData, "GET: /explore/nouns/more, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

execute.get('/more', function(req, res){
  // this is a api for temp use, just a way before the main '/' method matured.
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /explore/nouns/more ');
  _handle_GET_nouns_exploreMore(req, res);
})

execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /explore/nouns ');
  _handle_GET_nouns_explore(req, res);
})

module.exports = execute;
