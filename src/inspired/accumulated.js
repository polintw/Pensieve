const express = require('express');
const execute = express.Router();
const winston = require('../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_units = require('../../db/models/index').units;
const _DB_attri = require('../../db/models/index').attribution;
const _DB_inspireds = require('../../db/models/index').inspireds;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
} = require('../utils/reserrHandler.js');

async function _handle_GET_accumulated_Inspired(req, res){
  const userId = req.extra.tokenUserId; //use userId passed from pass.js

  try {
    //now, we to prepared created time of last Unit res to client in last req.
    //but it is possible, the 'date' in query are not a 'date', and param from query could only be parse as 'string', we need to turn it into time
    let unitBase = new Date(req.query.listUnitBase);
    const lastUnitTime = !isNaN(unitBase) ? unitBase : new Date(); // basically, undefined listUnitBase means first landing to the page
    // by query, see if we got a filter node
    const reqFilterNodes = req.query.filterNodes; // is an array contain one to several nodes id
    const reqListLimit = !isNaN(parseInt(req.query.limit)) ? parseInt(req.query.limit) : 12; // list length limit or 'undefined'
    // units id list res to client at final
    let unitsExposedList = [];
    let inspiredSelection = await _DB_inspireds.findAll({
      where: {
        id_user: userId,
        createdAt: { [Op.lt]: lastUnitTime },
      }
    });
    let inspiredUnits = inspiredSelection.map((row, index)=>{
      return row.id_unit;
    });


    if (!!reqFilterNodes) {
      let whereAttributes = {
        id_unit: inspiredUnits,
        id_noun: reqFilterNodes,
        author_identity: "user",
        used_authorId: null,
        createdAt: { [Op.lt]: lastUnitTime },
        source: null,
      };

      let unitsByAttri = await _DB_attri.findAll({
        where: whereAttributes,
        attributes: [
          //'max' here combined with 'group' prop beneath,
          //because the GROUP by would fail when the 'createdAt' is different between each row,
          //so we ask only the 'max' one by this method
          [Sequelize.fn('max', Sequelize.col('createdAt')), 'createdAt'], //fn(function, col, alias)
          //set attributes, so we also need to call every col we need
          'id_unit',
        ],
        group: 'id_unit', //Important. means we combined the rows by unit
        order: [ //make sure the order of arr are from latest
          Sequelize.literal('`createdAt` DESC') //and here, using 'literal' is due to some wierd behavior of sequelize,
        ],
        limit: reqListLimit,
      })
        .catch((err) => { throw new internalError(err, 131); });

      let unitsId = unitsByAttri.map((row, index) => {
        return row.id_unit;
      });

      unitsExposedList = await _DB_units.findAll({
        where: {
          id: unitsId,
          source: null,
        },
        order: [ //make sure the order of arr are from latest
          Sequelize.literal('`createdAt` DESC')
        ]
      })
        .then((results) => {
          let exposedIdlist = results.map((row, index) => { return row.exposedId; });

          return exposedIdlist;
        })
        .catch((err) => { throw new internalError(err, 131); });
    }
    else { // filterNode 'undefined' or empty
      unitsExposedList = await _DB_units.findAll({
        where: {
          id: inspiredUnits
        },
        order: [ //make sure the order of arr are from latest
          Sequelize.literal('`createdAt` DESC') //and here, using 'literal' is due to some wierd behavior of sequelize,
        ],
        limit: reqListLimit
      })
        .then((results) => {
          let exposedIdlist = results.map((row, index) => { return row.exposedId; });

          return exposedIdlist;
        })
        .catch((err) => { throw new internalError(err, 131); });
    };


    let sendingData = {
      unitsList: [],
      scrolled: true, // true if theere is any qualified Unit not yet res
      temp: {}
    };

    if (unitsExposedList.length < reqListLimit) sendingData.scrolled = false;
    sendingData.unitsList = unitsExposedList;

    _res_success(res, sendingData, "GET: /paths/accumulated, complete.");

  }
  catch (error) {
    _handle_ErrCatched(error, req, res);
    return;
  }
}

execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /inspired/accumulated ');
  _handle_GET_accumulated_Inspired(req, res);
})

module.exports = execute;
