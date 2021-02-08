const express = require('express');
const execute = express.Router();
const winston = require('../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_units = require('../../db/models/index').units;
const _DB_paths = require('../../db/models/index').paths;
const _DB_attri = require('../../db/models/index').attribution;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
} = require('../utils/reserrHandler.js');

async function _handle_GET_shareds_nodesAccumulated(req, res){
  const userId = req.extra.tokenUserId; //use userId passed from pass.js
  const reqPathProject = !!req.query.pathProject ? req.query.pathProject : false; // id of pathProject or 'undefined'
  const reqNodes = !!req.query.nodesList ? req.query.nodesList : []; // in case the list in params was empty or not exist

  try{
    // first, pick path info if request for path project
    let pathInfo = '';
    if(reqPathProject){
      pathInfo = await _DB_paths.findOne({
        where: {pathName: reqPathProject}
      });
      // if 'null' result -> not a valid pathName
      if(!pathInfo){ //'null'
        throw new notFoundError("Project you request was not found. Only a valid path name was allowed.", 52);
        return; //stop and end the handler.
      };
    };
    // select latest unit to each node from table nouns
    let whereAttributes = reqPathProject ? ({
      id_noun: reqNodes,
      id_author: userId,
      author_identity: "pathProject",
      used_authorId: pathInfo.id
    }) : ({
        id_noun: reqNodes,
        id_author: userId,
        author_identity: "user",
        used_authorId: null,
    });
    let unitsByAttri = await _DB_attri.findAll({
      where: whereAttributes,
      order: [ //make sure the order of arr are from latest
        Sequelize.literal('`createdAt` ASC')
      ]
    });
    let unitsId = unitsByAttri.map((row, index)=>{
      return row.id_unit;
    });

    let unitsInfo = await _DB_units.findAll({
        where: {
          id: unitsId
        }
      });
    let unitsExposedIdKey = {};
    unitsInfo.forEach((row, index) => {
      unitsExposedIdKey[row.id] = row.exposedId
    });

    let sendingData={
      nodesUnits: {},
      temp: {}
    };
    // make the list by exposedId from unitsInfo
    unitsByAttri.forEach((row, index) => {
      if(row.id_noun in sendingData.nodesUnits){
        sendingData.nodesUnits[row.id_noun].push(unitsExposedIdKey[row.id_unit]);
      }
      else{
        sendingData.nodesUnits[row.id_noun] = [unitsExposedIdKey[row.id_unit]];
      };
    });


    _res_success(res, sendingData, "GET: /shareds/accumulated, /depth, complete.");

  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return;
  }
}

async function _handle_GET_accumulated_Share(req, res){
  const userId = req.extra.tokenUserId; //use userId passed from pass.js

  try {
    //now, we to prepared created time of last Unit res to client in last req.
    //but it is possible, the 'date' in query are not a 'date', and param from query could only be parse as 'string', we need to turn it into time
    let unitBase = new Date(req.query.listUnitBase);
    const lastUnitTime = !isNaN(unitBase) ? unitBase : new Date(); // basically, undefined listUnitBase means first landing to the page
    // by query, see if we got a filter node
    const reqFilterNodes = req.query.filterNodes; // is an array contain one to several nodes id
    const reqListLimit = !isNaN(parseInt(req.query.limit)) ? parseInt(req.query.limit) : 12; // list length limit or 'undefined'
    const reqPathProject = !!req.query.pathProject ? req.query.pathProject : false; // id of pathProject or 'undefined'
    const reqMixIdentity = !!req.query.mixIdentity ? req.query.mixIdentity : false; // currently 'all' or undefined
    // judge the 'range' we are going to pick, uf pathProject or if mixIdentity
    let whereRange = 'personalOnly';
    if(reqPathProject) whereRange = 'pathProjectOnly';
    if(reqMixIdentity) whereRange = 'mixAll';
    // units id list res to client at final
    let unitsExposedList = [];

    // first, pick path info if request for path project
    let pathInfo = '';
    if(reqPathProject || reqMixIdentity){
      pathInfo = await _DB_paths.findOne({
        where: {pathName: reqPathProject}
      });
      // and allow 'null', would just select nothing
    };
    let whereAttributes = {};
    switch (whereRange) {
      case 'pathProjectOnly':
        whereAttributes = {
          id_author: userId,
          author_identity: "pathProject",
          used_authorId: pathInfo.id,
          createdAt: { [Op.lt]: lastUnitTime },
        };
        break;
      case 'mixAll':
        whereAttributes = {
          id_author: userId,
          createdAt: { [Op.lt]: lastUnitTime },
        };
        break;
      default: // 'personalOnly'
        whereAttributes = {
          id_author: userId,
          author_identity: "user",
          used_authorId: null,
          createdAt: { [Op.lt]: lastUnitTime },
        };
    };
    if (!!reqFilterNodes) {
      whereAttributes = Object.assign(whereAttributes, {id_noun: reqFilterNodes});

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
        where: {id: unitsId},
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
        where: whereAttributes,
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

execute.get('/depth', function(req, res){
  if (process.env.NODE_ENV == 'development') winston.verbose('GET: /shareds/accumulated, /depth.');
  _handle_GET_shareds_nodesAccumulated(req, res);
})

execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /share/accumulated ');
  _handle_GET_accumulated_Share(req, res);
})

module.exports = execute;
