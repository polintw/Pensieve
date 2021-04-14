const express = require('express');
const execute = express.Router();
const winston = require('../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_paths = require('../../db/models/index').paths;
const _DB_units = require('../../db/models/index').units;
const _DB_attri = require('../../db/models/index').attribution;
const _DB_pathsSubcate = require('../../db/models/index').paths_subcate;
const _DB_unitsPathsSubdis = require('../../db/models/index').units_paths_subdistribute;
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

    let unitsId = [];
    let byAttriConditions = {
      id_noun: reqNodes,
      used_authorId: pathInfo.id,
      author_identity: "pathProject"
    };

    if(!!req.query.filterSubCate){ // if we are limit by sub category, select units first
      const subCatesInfo = await _DB_pathsSubcate.findOne({
        where: {
          id_path: pathInfo.id,
          exposedId: req.query.filterSubCate
        }
      });
      const subCateUnits = await _DB_unitsPathsSubdis.findAll({
        where: {
          id_path: pathInfo.id,
          id_subPath: subCatesInfo.id,
        }
      });
      unitsId = subCateUnits.map((row, index)=>{ return row.id_unit;});
      byAttriConditions['id_unit'] = unitsId;
    };

    let unitsByAttri = await _DB_attri.findAll({
      where: byAttriConditions,
      order: [
        Sequelize.literal('`createdAt` ASC')
      ]
    });
    unitsId = unitsByAttri.map((row, index)=>{
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
    // by query,
    const reqFilterNodes = req.query.filterNodes; // any filter node, is an array contain one to several nodes id
    const reqFilterSubcate = req.query.subCate; // under any subcate, could be exposedId of category or 'null'
    // units id list res to client at final
    let unitsExposedList = [];

    if(!!reqFilterSubcate){
      const subCatesInfo = await _DB_pathsSubcate.findOne({
        where: {
          id_path: pathInfo.id,
          exposedId: reqFilterSubcate
        }
      });
      if(!subCatesInfo){ //'null'
        throw new notFoundError("Category you request was not found. Please use a valid one.", 53);
        return; //stop and end the handler.
      };
      const unitsByPathSubcate = await _DB_unitsPathsSubdis.findAll({
        where: {
          id_path: pathInfo.id,
          id_subPath: subCatesInfo.id,
          createdAt: {[Op.lt]: lastUnitTime},
        }
      });
      let unitsPathSubcateObj = {};
      let unitsId = unitsByPathSubcate.map((row, index)=>{
        // also deal with the unitsPathSubcateObj
        unitsPathSubcateObj[row.id_unit] = row;
        return row.id_unit;
      });
      if(!!reqFilterNodes){
        unitsId = await _DB_attri.findAll({
          where: {
            id_unit: unitsId,
            id_noun: reqFilterNodes,
            used_authorId: pathInfo.id,
            author_identity: "pathProject",
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
        })
        .then((results)=>{
          let unitsByAttri = results.map((row, index)=>{ return row.id_unit;});
          return unitsByAttri;
        })
        .catch((err)=>{ throw new internalError(err ,131); });
      }

      // keep units list limit to 12 here, outside the above selection
      if(unitsId.length > 12) unitsId.splice(12); // rm all items after 12nd

      unitsExposedList = await _DB_units.findAll({
        where: {id: unitsId}
      })
      .then((results)=>{
        // and we 'order' the unitsList by 'subcate serial'
        let exposedIdlist = [];
        let unitsArrBySubcateSerial = [];
        results.forEach((row, index)=>{
          unitsArrBySubcateSerial.push({
            exposedId: row.exposedId,
            serial: unitsPathSubcateObj[row.id].serial_subPath
          });
        });
        unitsArrBySubcateSerial.sort((a, b)=>{
          return a.serial - b.serial;
        });
        unitsArrBySubcateSerial.forEach((obj, index)=>{
          exposedIdlist.push(obj.exposedId);
        });

        return exposedIdlist;
      })
      .catch((err)=>{ throw new internalError(err ,131); });

    }
    else if(!!reqFilterNodes){
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
        where: {id: unitsId},
        order: [ //make sure the order of arr are from latest
          Sequelize.literal('`createdAt` DESC')
        ]
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
