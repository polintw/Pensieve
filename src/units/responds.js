const express = require('express');
const execute = express.Router();
const winston = require('../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_units = require('../../db/models/index').units;
const _DB_responds = require('../../db/models/index').responds;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
  notFoundError
} = require('../utils/reserrHandler.js');

async function _handle_GET_units_Responds(req, res){
  const userId = req.extra.tokenUserId; //use userId passed from pass.js
  if(!userId){ //somehow the user pass the checkpoint even has no token
    let message = `res code 401: missing token if you want to req this resource, to route "${req.originalUrl}".`;
    _handle_ErrCatched(new authorizedError(message, 89), req, res);
  };
  const reqExposedId = req.query.exposedId;
  const reqLimit = Number(req.query.limit); // query in req is always a string, turn it into a number
  const unitBase = new Date(req.query.listUnitBase);
  const lastUnitTime = !isNaN(unitBase) ? unitBase : new Date(); // basically, undefined listUnitBase means first landing to the page

  try{
    const targetUnit = await _DB_units.findOne({
      where: {exposedId: reqExposedId}
    });
    // if 'null' result -> not a valid exposedId
    if(!targetUnit){ //'null'
      throw new notFoundError("Unit you request was not found. Only a valid id was allowed.", 51);
      return; //stop and end the handler.
    };
    const targetUnitId = targetUnit.id;

    const respondsSelection = await _DB_responds.findAll({
      where: {
        id_primer: targetUnitId,
        createdAt: {[Op.lt]: lastUnitTime},
      },
      limit: !!reqLimit ? reqLimit : 8
    });
    const respondsUnits = respondsSelection.map((row, index)=>{ return row.id_unit;});
    const unitsRows = await _DB_units.findAll({
      where: {id: respondsUnits}
    });

    let sendingData={
      unitsList: [],
      scrolled: true,
      temp: {}
    };

    unitsRows.forEach((row, index)=>{
      sendingData.unitsList.unshift(row.exposedId); //let the latest in the top at client view
    });
    if(sendingData.unitsList.length == 0) sendingData.scrolled = false;

    _res_success(res, sendingData, "GET: /units/responds, complete.");
  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return;
  }

}

execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /units/responds ');
  _handle_GET_units_Responds(req, res);
})

module.exports = execute;
