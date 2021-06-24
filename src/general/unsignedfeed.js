const express = require('express');
const execute = express.Router();
const winston = require('../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_units = require('../../db/models/index').units;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  notFoundError,
  internalError
} = require('../utils/reserrHandler.js');

async function _handle_GET_unsignedfeed(req, res){
  try{
    //we are going to prepared created time of last Unit res to client in last req.
    //but it is possible, the 'date' in query are not a 'date', and param from query could only be parse as 'string', we need to turn it into time
    let unitBase = new Date(req.query.listUnitBase);
    const lastUnitTime = !isNaN(unitBase) ? unitBase : new Date(); // basically, undefined listUnitBase means first landing to the page
    // units id list res to client at final
    let unitsExposedList = [];

    unitsExposedList = await _DB_units.findAll({
      where: {
        source: null,
        createdAt: {
          [Op.and]: [
            { [Op.lt]: lastUnitTime }, { [Op.gt]: "2021-01-02" }
          ]
        },
        used_authorId: {
          [Op.or]: [{[Op.notIn]: [15, 16]}, null]
        }
      },
      order: [ //make sure the order of arr are from latest
        Sequelize.literal('`createdAt` DESC') //and here, using 'literal' is due to some wierd behavior of sequelize,
      ],
      limit: 5
    })
    .then((results)=>{
      let exposedIdlist = results.map((row, index)=>{ return row.exposedId;});

      return exposedIdlist;
    })
    .catch((err)=>{ throw new internalError(err ,131); });


    let sendingData={
      unitsList: [],
      scrolled: false,
      temp: {}
    };
    sendingData.unitsList = unitsExposedList;

    _res_success(res, sendingData, "GET: /unsignedfeed, complete.");

  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return;
  }
}

execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /unsignedfeed.');
  _handle_GET_unsignedfeed(req, res);
})

module.exports = execute;
