const express = require('express');
const execute = express.Router();
const winston = require('../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_units = require('../../db/models/index').units;
const _DB_inspireds = require('../../db/models/index').inspireds;

const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  forbbidenError,
  internalError,
  validationError
} = require('../utils/reserrHandler.js');

async function _handle_GET_inspired_byUnit(req, res){
  const userId = req.extra.tokenUserId;
  const exposedId = req.query.unitId;

  try{
    // first, select & check the Unit by exposedId
    let unitOrigin = await _DB_units.findOne({
      where: {exposedId: exposedId}
    });
    let unitId = !!unitOrigin ? unitOrigin.id : ''; // unitOrigin = null if the exposedId was invalid
    // straight forward, just select from inspireds by userId + unitId
    let inspiredify = await _DB_inspireds.findOne({
      where: {
        id_user: userId,
        id_unit: unitId
      }
    })
    .catch((err)=>{ throw new internalError(err ,131); });

    let sendingData={
      inspiredify: !!inspiredify ? true : false, // inspiredify = null || row
      temp: {}
    };

    _res_success(res, sendingData, "GET: /inspired plain, complete.");

  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return;
  }
}

async function _handle_POST_inspired_byUnit(req, res){
  const userId = req.extra.tokenUserId;
  const exposedId = req.query.unitId;

  try{
    // check if the user is author
    let unitOrigin = await _DB_units.findOne({
      where: {
        exposedId: exposedId
      }
    });
    if( !unitOrigin ){ // if unitOrigin = null
      throw new validationError(" from POST inspired/plain, invalid exposedId from user's req.", 325);
      return;
    };
    let authorId = unitOrigin.id_author;
    if(authorId == userId){ // author req to inspired himself
      throw new forbbidenError(" from POST inspired/plain, author "+ userId+ ", try to inspired self's contribution.", 36);
      return;
    };
    // start here, depend on if you 'inspired' the same unit before
    // so, stat from selecting if the record exist
    let unitId = unitOrigin.id;
    let inspiredData = await _DB_inspireds.findOne({
      where: {
        id_user: userId,
        id_unit: unitId
      }
    })
    .catch((err)=>{ throw new internalError(err ,131); });
    // delete if exist, or insert new row on the contrast
    if(!inspiredData){ // record not exist
      await _DB_inspireds.create({id_unit: unitId, id_user: userId});
    }
    else{ // record exist
      await _DB_inspireds.destroy({
        where: {id_unit: unitId, id_user: userId}
      });
    };

    let sendingData={
      temp: {}
    };

    _res_success(res, sendingData, "POST: /inspired plain, complete.");
  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return;
  }
}


execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /inspired plain.');
  _handle_GET_inspired_byUnit(req, res);
})

execute.post('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('POST: /inspired plain.');
  _handle_POST_inspired_byUnit(req, res);
})

module.exports = execute;
