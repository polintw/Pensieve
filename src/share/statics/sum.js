const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_units = require('../../../db/models/index').units;
const _DB_usersUnits = require('../../../db/models/index').users_units;
const _DB_unitsStatInteract = require('../../../db/models/index').units_stat_interact;
const {_res_success} = require('../../utils/resHandler.js');
const {
  _handle_ErrCatched,
  forbbidenError,
  internalError,
  validationError
} = require('../../utils/reserrHandler.js');

async function _sum_Engaged(unitId, authorId){
  const unitReadersRow = await _DB_usersUnits.findAll({
    where: {
      id_unit: unitId,
      id_user: { [Op.ne]: authorId }
    }
  });

  return unitReadersRow.length;
}

async function _sum_Loaded(unitId, authorId) {
  const unitReadersRow = await _DB_usersUnits.findAll({
    where: {
      id_unit: unitId,
      id_user: {[Op.ne]: authorId}
    }
  });
  const unitStatInteract = await _DB_unitsStatInteract.findOne({
    where: {
      id_unit: unitId
    }
  });
  let totalLoad = 0;
  unitReadersRow.forEach((row, index) => {
    totalLoad += row.count;
  });
  totalLoad += unitStatInteract.times_unsignedLoad;

  return totalLoad;
};

async function _handle_GET_share_staticsSum(req, res){
  const userId = req.extra.tokenUserId; // check at the higher level, the user was author of the unit
  const exposedId = req.reqUnitId;

  try{
    // start here
    let unitOrigin = await _DB_units.findOne({
      where: {exposedId: exposedId}
    });
    let unitId = unitOrigin.id;
    let targetSum = 0;

    switch (req.query.target) {
      case "loaded":
        let loadSum = await _sum_Loaded(unitId, userId);
        targetSum = loadSum;
        break;
      case "engaged":
        let readSum = await _sum_Engaged(unitId, userId);
        targetSum = readSum;
        break;
      default:
        null
    };

    let sendingData={
      sum: targetSum,
      temp: {}
    };

    _res_success(res, sendingData, "GET: /share/statics, sum, complete.");
  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return;
  }
}

module.exports = _handle_GET_share_staticsSum;
