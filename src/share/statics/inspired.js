const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_units = require('../../../db/models/index').units;
const _DB_inspireds = require('../../../db/models/index').inspireds;
const _DB_lastVisitIndex = require('../../../db/models/index').lastvisit_index;
const {_res_success} = require('../../utils/resHandler.js');
const {
  _handle_ErrCatched,
  forbbidenError,
  internalError,
  validationError
} = require('../../utils/reserrHandler.js');

async function _sum_Inspired(unitId){
  const inspiredRows = await _DB_inspireds.findAll({
    where: {
      id_unit: unitId
    }
  });

  return inspiredRows.length;
}

async function _sum_NewInspired(unitId, userId){
  const userLastVisit = await _DB_lastVisitIndex.findOne({
    where: {id_user: userId}
  });
  const inspiredRows = await _DB_inspireds.findAll({
    where: {
      id_unit: unitId,
      createdAt: {[Op.gt]: userLastVisit.updatedAt}
    }
  });

  return inspiredRows.length;
}

async function _lastUser_Inspired(unitId){
  const targetInspired = await _DB_inspireds.findAll({
    where: {
      id_unit: unitId
    },
    limit: 1, // only select the latest one
    order: [ //make sure the order of arr are from latest
      Sequelize.literal('`createdAt` DESC') //and here, using 'literal' is due to some wierd behavior of sequelize
    ],
  });
  let lastInspiredUser = null;
  if(!!targetInspired) lastInspiredUser = targetInspired[0].id_user;

  return lastInspiredUser;
}

async function _switch_inspiredStaticsQuery(unitId, userId, queryKey, queryValue){
  switch (queryKey) {
    case 'sum':
      let inspiredSum = await _sum_Inspired(unitId);
      return {sum: inspiredSum};
      break;
    case 'lastUser':
      let inspiredLastUser = await _lastUser_Inspired(unitId);
      return {lastUser: inspiredLastUser};
      break;
    case 'newUsersSum':
      let inspiredNewSum = await _sum_NewInspired(unitId, userId);
      return {sumNew: inspiredNewSum};
      break;
    default:
      return {}
  }
}

async function _handle_GET_share_staticsInspired(req, res){
  const userId = req.extra.tokenUserId;
  const exposedId = req.reqUnitId;

  try{
    // start here
    let unitOrigin = await _DB_units.findOne({
      where: {exposedId: exposedId}
    });
    let unitId = unitOrigin.id;
    let sendingData={
      temp: {}
    };
    let params = Object.keys(req.query);
    for( let i=0; i< params.length; i++){
      let queryKey = params[i];
      let queryValue = req.query[queryKey];
      let staticsObj = await _switch_inspiredStaticsQuery(unitId, userId, queryKey, queryValue);
      sendingData = Object.assign({}, sendingData, staticsObj);
    };

    _res_success(res, sendingData, "GET: /share/statics, inspired, complete.");
  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return;
  }
}

module.exports = _handle_GET_share_staticsInspired;
