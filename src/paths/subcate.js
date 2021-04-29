const express = require('express');
const execute = express.Router();
const winston = require('../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_paths = require('../../db/models/index').paths;
const _DB_units = require('../../db/models/index').units;
const _DB_pathsSubcate = require('../../db/models/index').paths_subcate;
const _DB_unitsPathsSubdis = require('../../db/models/index').units_paths_subdistribute;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  notFoundError
} = require('../utils/reserrHandler.js');

async function _handle_GET_paths_subcateBasic(req, res){
  const reqPathProject = req.query.pathProject;
  const tokenId = req.extra.tokenify ? req.extra.tokenUserId : null; // userId passed from pass.js(no token is possible)

  try{
    const targetProject = await _DB_paths.findOne({
      where: {pathName: reqPathProject}
    });
    // if 'null' result -> not a valid pathName
    if(!targetProject){ //'null'
      throw new notFoundError("Project you request was not found. Only a valid path name was allowed.", 52);
      return; //stop and end the handler.
    };
    // select all subcate the pathProject have.
    let subCates = await _DB_pathsSubcate.findAll({
      where: {
        id_path: targetProject.id
      }
    });
    let subCatesObj = {}, unitsSubcateBasic ={}; // items going to res
    let subCatesIdList=[], subCatesIdRefer={}; // items local use
    let subCatesList = subCates.map((row, index)=>{
      subCatesObj[row.exposedId] = {
        subCateId: row.exposedId,
        name: row.name,
        unitsListBySerial: [],
        description: row.description
      };
      subCatesIdList.push(row.id);
      subCatesIdRefer[row.id] = row.exposedId;
      return row.exposedId;
    });
    // select units in each subcate
    if(subCatesList.length > 0){
      let unitsInAllSubcates = await _DB_unitsPathsSubdis.findAll({
        where: {
          id_path: targetProject.id,
          id_subPath: subCatesIdList
        }
      });
      let subcatesUnits = {};
      let unitsList = unitsInAllSubcates.map((row, index)=>{
        if(row.id_subPath in subcatesUnits){
          subcatesUnits[row.id_subPath]['serialRefer'][row.serial_subPath] = row.id_unit;
        } else{
          subcatesUnits[row.id_subPath] = {
            serialRefer: {}
          };
          subcatesUnits[row.id_subPath]["serialRefer"][row.serial_subPath] = row.id_unit;
        };
        return row.id_unit;
      });
      let unitsInfoSelection = await _DB_units.findAll({
        where: {
          id: unitsList
        }
      });
      let unitsIdRefer = {};
      unitsInfoSelection.forEach((row, index) => {
        unitsIdRefer[row.id] = row.exposedId;
        unitsSubcateBasic[row.exposedId] = {
          unitId: row.exposedId,
          pic_layer0: row.url_pic_layer0,
          pic_layer1: row.url_pic_layer1
        }
      });
      subCatesIdList.forEach((subCateId, index) => {
        // first, order units of this subCate in subcatesUnits
        let keys = Object.keys(subcatesUnits[subCateId]["serialRefer"]);
        let unitsExposedIdList = []; // list keep the desired ordered exposedId list
        for(let i =0; i < keys.length; i++){
          let cycleUnitId = subcatesUnits[subCateId]['serialRefer'][i];
          unitsExposedIdList.push(unitsIdRefer[cycleUnitId]);
        };
        subCatesObj[subCatesIdRefer[subCateId]].unitsListBySerial = unitsExposedIdList;
      });
    };

    let sendingData = {
      subCatesList: subCatesList,
      subCatesObj: subCatesObj,
      unitsSubcateBasic: unitsSubcateBasic,
      temp: {}
    };

    _res_success(res, sendingData, "GET: /paths/subcate, /basic, complete.");
  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return;
  }

}

execute.get('/basic', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /paths/subcate, /basic. ');
  _handle_GET_paths_subcateBasic(req, res);
})

module.exports = execute;
