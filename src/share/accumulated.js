const express = require('express');
const execute = express.Router();
const winston = require('../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_units = require('../../db/models/index').units;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
} = require('../utils/reserrHandler.js');

function _handle_GET_accumulated_Share(req, res){
  const userId = req.extra.tokenUserId; //use userId passed from pass.js

  let sendingData={
    unitsList: [],
    temp: {}
  };

  _DB_units.findAll({
    where: {id_author: userId},
    limit: 32
  })
  .then((resultShareds)=>{
    if(resultShareds.length < 1){return sendingData}; // if there is not any shareds record at all

    resultShareds.forEach((row, index)=>{
      sendingData.unitsList.unshift(row.id); //let the latest in the top at client view
    });

    return sendingData;
  }).then((sendingData)=>{
    _res_success(res, sendingData, "Complete, GET: user actions/shareds.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /share/accumulated ');
  _handle_GET_accumulated_Share(req, res);
})

module.exports = execute;
