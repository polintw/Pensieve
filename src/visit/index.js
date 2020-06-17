const express = require('express');
const execute = express.Router();
const winston = require('../../config/winston.js');
const Sequelize = require('sequelize');
const _DB_lastvisitIndex = require('../../db/models/index').lastvisit_index;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
} = require('../utils/reserrHandler.js');

function _handle_GET_visit_Index(req, res){
  new Promise((resolve, reject)=>{
    let userId = req.extra.tokenUserId;

    return _DB_lastvisitIndex.findOne({
      where: {id_user: userId},
      attributes: ['updatedAt', 'createdAt']
    }).then((lastVisit)=>{

      let sendingData={
        lastTime: lastVisit.updatedAt,
        temp: {}
      };

      resolve(sendingData);
    }).catch((err)=>{
      reject(new internalError(err, 131));
    });

  }).then((sendingData)=>{
    _res_success(res, sendingData, "lastvisit, GET: /index, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

function _handle_PATCH_visit_Index(req, res){
  new Promise((resolve, reject)=>{
    let userId = req.extra.tokenUserId;

    let pUpdateVisitIndex = _DB_lastvisitIndex.update( //because we retrieve updatedAt in GET, we just 'update' to create action record
          {ip: req.ip},
          {where: {id_user: userId}}
        ).catch((err)=>{throw err});
        /*
          Originally, there is another promise() update a deprecated table "users_custom_index",
          so now the procedure has been rm, but the structure remained.
        */
    return Promise.all([
      pUpdateVisitIndex
    ]).then(()=>{
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

execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('lastvisit, GET: /index ');
  _handle_GET_visit_Index(req, res);
});
execute.patch('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('lastvisit, PATCH: /index ');
  _handle_PATCH_visit_Index(req, res);
});

module.exports = execute;
