const express = require('express');
const execute = express.Router();
const winston = require('../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_units = require('../../db/models/index').units;
const _DB_inspireds = require('../../db/models/index').inspireds;
const _DB_usersUnits = require('../../db/models/index').users_units;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  forbbidenError,
  internalError,
  validationError
} = require('../utils/reserrHandler.js');

async function _sum_Inspired(unitId, lastUser = false){
  const inspiredRows = await _DB_inspireds.findAll({
    where: {
      id_unit: unitId
    },
    order: [ //make sure the order of arr are from latest
      Sequelize.literal('`createdAt` DESC') //and here, using 'literal' is due to some wierd behavior of sequelize,
      //it would make an Error if we provide col name by 'arr'
    ]
  });
  let lastInspiredUser = undefined;
  if(!!lastUser) lastInspiredUser = inspiredRows[0].id_user;

  return [inspiredRows.length, lastInspiredUser];
}

async function _sum_Read(unitId, lastUser = false){
  const unitReadersRow = await _DB_usersUnits.findAll({
    where: {
      id_unit: unitId
    }
  });

  return [unitReadersRow.length];
}

async function _handle_GET_share_staticsSum(req, res){
  const userId = req.extra.tokenUserId;
  const exposedId = req.reqUnitId;

  try{
    // first, select & check the Unit by exposedId
    let unitOrigin = await _DB_units.findOne({
      where: {exposedId: exposedId}
    });
    if( !unitOrigin ){ // if unitOrigin = null
      throw new validationError(" from GET /share/statics, sum, invalid exposedId from user's req.", 325);
      return;
    };
    // check if the user is author
    let authorId = unitOrigin.id_author;
    if(authorId != userId){ // user are not author
      throw new forbbidenError(" from GET /share/statics, sum, user: "+ userId+ ", trying to request statics of unit: "+unitOrigin.id+".", 39);
      return;
    };
    // start here
    let unitId = unitOrigin.id;
    let target = req.query.target;
    let [targetSum, lastUserAct] = [0,undefined];

    let processedArr=[]; // used in switch()
    switch (target) {
      case "inspired":
        processedArr = await _sum_Inspired(unitId, !!req.query.lastUser? true : false);
        targetSum = processedArr[0];
        lastUserAct = processedArr[1];
        break;
      case "read":
        processedArr = await _sum_Read(unitId, !!req.query.lastUser? true : false);
        targetSum = processedArr[0];
        lastUserAct = processedArr[1]; // actually, lastUserAct would be 'undefined' due to empty return from _sum_Read()
        break;
      default:
        null
    };

    let sendingData={
      sum: targetSum,
      temp: {}
    };
    if(!!req.query.lastUser) sendingData["lastUser"] = lastUserAct;

    _res_success(res, sendingData, "GET: /share/statics, sum, complete.");
  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return;
  }
}


execute.get('/sum', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /share/statics, sum.');
  _handle_GET_share_staticsSum(req, res);
})

module.exports = execute;
