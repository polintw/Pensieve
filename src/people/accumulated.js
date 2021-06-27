const express = require('express');
const execute = express.Router();
const winston = require('../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_users = require('../../db/models/index').users;
const _DB_units = require('../../db/models/index').units;
const _DB_attri = require('../../db/models/index').attribution;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  notFoundError,
  internalError
} = require('../utils/reserrHandler.js');

async function _handle_GET_people_accumulated(req, res){
  const reqUserId = req.query.userId;

  try{
    // validation: if the user id was valid
    const targetUser = await _DB_users.findOne({
      where: {id: reqUserId}
    });
    // if 'null' result -> not a valid pathName
    if(!targetUser){ //'null'
      throw new notFoundError("User you request was not found. Please use a valid user id.", 50);
      return; //stop and end the handler.
    };
    //now, we to prepared created time of last Unit res to client in last req.
    //but it is possible, the 'date' in query are not a 'date', and param from query could only be parse as 'string', we need to turn it into time
    let unitBase = new Date(req.query.listUnitBase);
    const lastUnitTime = !isNaN(unitBase) ? unitBase : new Date(); // basically, undefined listUnitBase means first landing to the page
    // units id list res to client at final
    let unitsExposedList = [];

    unitsExposedList = await _DB_units.findAll({
      where: {
        id_author: targetUser.id,
        author_identity: 'user',
        createdAt: {
          [Op.and]: [
            { [Op.lt]: lastUnitTime }, { [Op.gt]: "2021-01-02" }
          ]
        },
        source: null,
      },
      order: [ //make sure the order of arr are from latest
        Sequelize.literal('`createdAt` DESC') //and here, using 'literal' is due to some wierd behavior of sequelize,
      ],
      limit: 12
    })
    .then((results)=>{
      let exposedIdlist = results.map((row, index)=>{ return row.exposedId;});

      return exposedIdlist;
    })
    .catch((err)=>{ throw new internalError(err ,131); });


    let sendingData={
      unitsList: [],
      scrolled: true, // true if theere is any qualified Unit not yet res
      temp: {}
    };

    if(unitsExposedList.length < 12 ) sendingData.scrolled = false;
    sendingData.unitsList = unitsExposedList;

    _res_success(res, sendingData, "GET: /people/accumulated, complete.");

  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return;
  }
}

execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /people/accumulated.');
  _handle_GET_people_accumulated(req, res);
})

module.exports = execute;
