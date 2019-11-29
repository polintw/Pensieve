const express = require('express');
const execute = express.Router();
const jwt = require('jsonwebtoken');
const winston = require('../../config/winston.js');
const {verify_key} = require('../../config/jwt.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_broads = require('../../db/models/index').broads;
const {_res_success} = require('../utils/resHandler.js');
const {
  _select_Basic
} = require('../utils/dbSelectHandler.js');
const {
  _handle_ErrCatched,
  internalError,
} = require('../utils/reserrHandler.js');

function _handle_GET_feed_mainBroads(req, res){
  new Promise((resolve, reject)=>{
    const userId = req.extra.tokenUserId;

    // in this api, we only return the units broaded by current user,
    //res only the list
    _DB_broads.findAndCountAll({
      where: {id_user: userId}
    })
    .then((resultsBroad)=>{
      let sendingData={
        unitsList: [],
        temp: {}
      };

      sendingData.unitsList = resultsBroad.rows.map((row, index)=>{
        return row.id_unit;
      })
      sendingData.unitsList.reverse(); //reverse the order, let the latest be the first
      //reverse() would change the original arr directly

      return sendingData;
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
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /feed/broads ');
  _handle_GET_feed_mainBroads(req, res);
})

module.exports = execute;
