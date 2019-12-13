const express = require('express');
const execute = express.Router();
const winston = require('../../config/winston.js');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_broads = require('../../db/models/index').broads;
const _DB_usersCustomIndex = require('../../db/models/index').users_custom_index;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
} = require('../utils/reserrHandler.js');

function _handle_GET_feed_mainBroads(req, res){
  new Promise((resolve, reject)=>{
    const userId = req.extra.tokenUserId;

    _DB_usersCustomIndex.findOne({
      where: {
        id_user: userId
      },
      attributes: ['last_visit', 'id_user']

    }).then((sendingData)=>{

      resolve(sendingData);
    }).catch((err)=>{
      reject(new internalError(err, 131));
    });
  }).then((sendingData)=>{
    _res_success(res, sendingData, "Complete, GET: /feed/broads.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}


execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('matchNodes, GET: /status/node');


})

module.exports = execute;
