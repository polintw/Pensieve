const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_units = require('../../../db/models/index').units;
const _DB_pathsSubcate = require('../../../db/models/index').paths_subcate;
const _DB_unitsPathsSubdis = require('../../../db/models/index').units_paths_subdistribute;
const {_res_success} = require('../../utils/resHandler.js');
const {
  _handle_ErrCatched,
  notFoundError
} = require('../../utils/reserrHandler.js');

async function _handle_GET_units_entitySubCates(req, res){
  const tokenId = req.extra.tokenify ? req.extra.tokenUserId : null; // userId passed from pass.js(no token is possible)
  const reqUnitExposed = req.query.unitId;

  try{
    // validation: if the unitId valid
    const targetUnit = await _DB_units.findOne({
      where: {
        exposedId: reqUnitExposed
      }
    });
    // if 'null' result -> not a valid pathName
    if(!targetUnit){ //'null'
      throw new notFoundError("Unit you request was not found. Please use a valid unit id.", 51);
      return; //stop and end the handler.
    };
    // validation: if the subCateId valid
    // (directly table <paths_subcate> because no other subCates yet)
    const desiredSubCate = await _DB_pathsSubcate.findOne({
      where: {
        exposedId: req.query.subCateId
      }
    });
    if(!desiredSubCate){ //'null'
      throw new notFoundError("Category you request was not found. Please use a valid one.", 53);
      return; //stop and end the handler.
    };

    // select directly from units_paths_subdistribute(only PathProject has sub-category now)
    const unitPathSubDis = await _DB_unitsPathsSubdis.findAll({
      where: {
        id_subPath: desiredSubCate.id // req.query.subCateId is the 'exposedId', not the used one here
      },
      order:['serial_subPath'] // make sure the units ordered by serial_subPath
    });
    let baseSerial = false, nextUnitId = null, previousUnitId = null, firstUnitId = null;
    let count = 0;
    while (count < unitPathSubDis.length) {
      if(count == 0) firstUnitId = unitPathSubDis[0].id_unit; // set the first one to a var
      if(unitPathSubDis[count].id_unit == targetUnit.id){
        baseSerial = unitPathSubDis[count].serial_subPath;
        nextUnitId = ((count+1) < unitPathSubDis.length) ? unitPathSubDis[count+1].id_unit : unitPathSubDis[0].id_unit;
        previousUnitId = ((count-1) < 0 ) ? unitPathSubDis[0].id_unit : unitPathSubDis[count-1].id_unit;
        break;
      };
      count += 1;
    };
    // select exposedId
    const unitSelection = await _DB_units.findAll({
      where: {
        id: [nextUnitId, previousUnitId, firstUnitId]
      }
    });
    let nextExposedId = false, prevExposedId = false, firstExposedId = false;
    unitSelection.forEach((row, index) => {
      if(row.id == nextUnitId) nextExposedId = row.exposedId;
      if(row.id == previousUnitId) prevExposedId = row.exposedId;
      if(row.id == firstUnitId) firstExposedId = row.exposedId;
    });

    let sendingData={
      confirm: ((baseSerial == 0) || baseSerial) ? true : false,
      serial_unit: {
        nextUnit: nextExposedId,
        prevUnit: prevExposedId,
        firstUnit: firstExposedId
      },
      temp: {}
    };

    _res_success(res, sendingData, "GET: /units/entity, subCates, complete.");
  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return;
  }
}

module.exports = _handle_GET_units_entitySubCates;
