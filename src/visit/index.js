const express = require('express');
const execute = express.Router();
//const jwt = require('jsonwebtoken');
//const {verify_key} = require('../../config/jwt.js');
const winston = require('../../config/winston.js');
const _DB_lastvisitIndex = require('../../db/models/index').lastvisit_index;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
} = require('../utils/reserrHandler.js');

function _handle_PATCH_visit_Index(req, res){
  new Promise((resolve, reject)=>{
    let userId = req.extra.tokenUserId;

    return _DB_lastvisitIndex.update(
      {ip: req.ip},
      {where: {id_user: userId}}
    ).then(()=>{
      //nothing need to return from this api
      let sendingData={
        temp: {}
      };

      resolve(sendingData);
    }).catch((err)=>{
      reject(new internalError(err, 131));
    });

  }).then((sendingData)=>{
    _res_success(res, sendingData, "lastvisit, PATCH: /index, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

execute.patch('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('lastvisit, PATCH: /index ');
  _handle_PATCH_visit_Index(req, res);
})

module.exports = execute;
