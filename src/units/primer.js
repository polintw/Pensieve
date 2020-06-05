const express = require('express');
const execute = express.Router();
const winston = require('../../config/winston.js');
const _DB_units = require('../../db/models/index').units;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  notFoundError,
  internalError,
} = require('../utils/reserrHandler.js');

async function _handle_GET_units_primer(req, res){
  //becuase we have verify the token at upper level,
  //and there is no need to use 'userId' in this function
  const reqExposedId = req.query.exposedId;

  try{
    const originalUnit = await _DB_units.findOne({
      where: {exposedId: reqExposedId},
      attributes: ['id', 'id_primer']
    });
    // if 'null' result -> not a valid exposedId
    if(!originalUnit){ //'null'
      _handle_ErrCatched(new notFoundError("Unit you request was not found. Only a valid id was allowed.", 51), req, res);
      return; //stop and end the handler.
    };

    const primerUnit = await _DB_units.findOne({
      where: { id: originalUnit.id_primer}
    });
    let sendingData = {
      temp: {},
    };
    if(!!primerUnit){ //got result
      sendingData['exposedId']= primerUnit.exposedId;
      sendingData['authorId']= primerUnit.id_author;
    };

    _res_success(res, sendingData, "GET: /units/primer, complete.");
  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return;
  }

}

execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /units/primer ');
  _handle_GET_units_primer(req, res);
})

module.exports = execute;
