const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_units = require('../../../db/models/index').units;
const _DB_attri = require('../../../db/models/index').attribution;
const {_res_success} = require('../../utils/resHandler.js');
const {
  _handle_ErrCatched,
  notFoundError,
  internalError
} = require('../../utils/reserrHandler.js');

async function _handle_GET_unit_related(req, res){
  const reqUserId = req.extra.tokenify ? req.extra.tokenUserId: '';
  const reqExposedId = req.reqExposedId;

  try{
    // validation: if the user id was valid
    const targetUnit = await _DB_units.findOne({
      where: {
        exposedId: reqExposedId
      }
    });
    // if 'null' result -> not a valid pathName
    if(!targetUnit){ //'null'
      throw new notFoundError("Unit you request was not found. Please use a valid unit id.", 51);
      return; //stop and end the handler.
    };

    let unitAttrisSelect = await _DB_attri.findAll({
      where: {
        id_unit: targetUnit.id
      }
    });

    let unitAttris = unitAttrisSelect.map((row, index)=>{
      return row.id_noun;
    });

    let relatedSelect = await _DB_attri.findAll({
      where: {
        id_noun: unitAttris,
        id_unit: {[Op.ne]: targetUnit.id}
      },
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
      limit: 2
    });

    let relatedUnits = relatedSelect.map((row, index)=>{
      return row.id_unit;
    });
    let now = new Date();
    let nowTime = now.getTime(); // milliseconds
    let relatedRange = nowTime - 6048000000; // 70 days

    let unitsSelect = await _DB_units.findAll(
      (relatedUnits.length > 1) ? {
        where: {
          id: relatedUnits
        }
      }: {
        where: {
          id: {[Op.ne]: targetUnit.id}
        },
        createdAt: {[Op.gt]: relatedRange},
        order: [ //make sure the order of arr are from latest
          Sequelize.literal('`createdAt` DESC') //and here, using 'literal' is due to some wierd behavior of sequelize,
        ],
      }
    );

    let sendingData={
      unitsList: [],
      temp: {}
    };

    if(relatedUnits.length > 1){
      unitsSelect.forEach((row, index) => {
        sendingData.unitsList.push(row.exposedId);
      });
    }
    else if(relatedUnits.length < 2 && unitsSelect.length > 1){
      // pick a random number under the length
      let randomNr1 = 0, randomNr2 = 0;
      while (randomNr1 == randomNr2) { // make sure the randomNr not the same
        randomNr1 = Math.floor(Math.random() * unitsSelect.length); // between 0 ~ unitsSelect.length(not incl.)
        randomNr2 = Math.floor(Math.random() * unitsSelect.length); // between 0 ~ unitsSelect.length(not incl.)
      };
      sendingData.unitsList.push(unitsSelect[randomNr1].exposedId);
      sendingData.unitsList.push(unitsSelect[randomNr2].exposedId);
    };
    // or empty if no units between the desired duration

    _res_success(res, sendingData, "GET: /units/single, related, complete.");

  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return;
  }
}

execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /units/single, related.');
  _handle_GET_unit_related(req, res);
})

module.exports = execute;
