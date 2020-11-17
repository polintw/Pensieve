const express = require('express');
const execute = express.Router();
const winston = require('../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_paths = require('../../db/models/index').paths;
const _DB_units = require('../../db/models/index').units;
const _DB_attri = require('../../db/models/index').attribution;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  notFoundError,
  internalError
} = require('../utils/reserrHandler.js');

async function _handle_GET_paths_nodesAccumulated(req, res){
  const reqPathProject = req.query.pathProject;
  const reqDepth = req.query.depth;
  const reqNodes = !!req.query.nodesList ? req.query.nodesList : []; // in case the list in params was empty or not exist

  try{
    let pathInfo = await _DB_paths.findOne({
      where: {pathName: reqPathProject}
    });
    // if 'null' result -> not a valid pathName
    if(!pathInfo){ //'null'
      throw new notFoundError("Project you request was not found. Only a valid path name was allowed.", 52);
      return; //stop and end the handler.
    };
    // first select all used nodes by the project
/*    let nodesByAttri = await _DB_attri.findAll({
      where: {
        used_authorId: pathInfo.id,
        author_identity: "pathProject"
      },
      attributes: [
        //'max' here combined with 'group' prop beneath,
        //because the GROUP by would fail when the 'createdAt' is different between each row,
        //so we ask only the 'max' one by this method
        [Sequelize.fn('max', Sequelize.col('createdAt')), 'createdAt'], //fn(function, col, alias)
        //set attributes, so we also need to call every col we need
        'id_noun',
      ],
      group: 'id_noun', //Important. means we combined the rows by node, each id_noun would only has one row
      include: { // inner join 'nouns' to get the basic info about the node
        model: _DB_nouns,
        as: 'nouns', // default alias for this table was 'noun'
        where: {
          id: Sequelize.col("attribution.id_noun")
        },
        attributes: ['id', 'name', 'parent', 'child', 'parent_id'],
        required: true // to let it become a inner JOIN
      }
    });
    let usedNodesList = nodesByAttri.map((row, index)=>{
      return row.id_noun;
    });
*/



    let unitsByAttri = await _DB_attri.findAll({
      where: {
        id_noun: reqNodes,
        used_authorId: pathInfo.id,
        author_identity: "pathProject"
      },
/*      attributes: [
        //'max' here combined with 'group' prop beneath,
        //because the GROUP by would fail when the 'createdAt' is different between each row,
        //so we ask only the 'max' one by this method
        [Sequelize.fn('max', Sequelize.col('createdAt')), 'createdAt'], //fn(function, col, alias)
        //set attributes, so we also need to call every col we need
        'id_noun',
        'id_unit',
      ],
      group: 'id_noun' //Important. means we combined the rows by node, each id_noun would only has one row
*/
      order: [
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
      sendingData.nodesUnits[row.id_noun] = unitsExposedIdKey[row.id_unit];
    });


    _res_success(res, sendingData, "GET: /paths/accumulated, /nodes, complete.");

  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return;
  }
}

async function _handle_GET_paths_accumulated(req, res){
  const reqPathProject = req.query.pathProject;

  try{
    let pathInfo = await _DB_paths.findOne({
      where: {pathName: reqPathProject}
    });
    // if 'null' result -> not a valid pathName
    if(!pathInfo){ //'null'
      throw new notFoundError("Project you request was not found. Only a valid path name was allowed.", 52);
      return; //stop and end the handler.
    };
    //now, we to prepared created time of last Unit res to client in last req.
    //but it is possible, the 'date' in query are not a 'date', and param from query could only be parse as 'string', we need to turn it into time
    let unitBase = new Date(req.query.listUnitBase);
    const lastUnitTime = !isNaN(unitBase) ? unitBase : new Date(); // basically, undefined listUnitBase means first landing to the page
    // by query, see if we got a filter node
    const reqFilterNodes = req.query.filterNodes; // is an array contain one to several nodes id
    // units id list res to client at final
    let unitsExposedList = [];

    if(!!reqFilterNodes){
      let unitsByAttri = await _DB_attri.findAll({
        where: {
          id_noun: reqFilterNodes,
          used_authorId: pathInfo.id,
          author_identity: "pathProject",
          createdAt: { [Op.lt]: lastUnitTime }
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
        limit: 12,
      })
      .catch((err)=>{ throw new internalError(err ,131); });

      let unitsId = unitsByAttri.map((row, index)=>{
        return row.id_unit;
      });

      unitsExposedList = await _DB_units.findAll({
        where: { id: unitsId }
      })
      .then((results)=>{
        let exposedIdlist = results.map((row, index)=>{ return row.exposedId;});

        return exposedIdlist;
      })
      .catch((err)=>{ throw new internalError(err ,131); });
    }
    else{
      unitsExposedList = await _DB_units.findAll({
        where: {
          used_authorId: pathInfo.id,
          author_identity: 'pathProject',
          createdAt: {[Op.lt]: lastUnitTime},
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
    };


    let sendingData={
      unitsList: [],
      scrolled: true, // true if theere is any qualified Unit not yet res
      temp: {}
    };

    if(unitsExposedList.length < 12 ) sendingData.scrolled = false;
    sendingData.unitsList = unitsExposedList;

    _res_success(res, sendingData, "GET: /paths/accumulated, complete.");

  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return;
  }
}

execute.get('/nodes', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /paths/accumulated, /nodes.');
  _handle_GET_paths_nodesAccumulated(req, res);
})

execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /paths/accumulated.');
  _handle_GET_paths_accumulated(req, res);
})

module.exports = execute;
