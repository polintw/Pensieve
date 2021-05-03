const express = require('express');
const execute = express.Router();
const winston = require('../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_paths = require('../../db/models/index').paths;
const _DB_units = require('../../db/models/index').units;
const _DB_inspireds = require('../../db/models/index').inspireds;
const _DB_pathsSubcate = require('../../db/models/index').paths_subcate;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  notFoundError
} = require('../utils/reserrHandler.js');

async function _handle_GET_paths_basic(req, res){
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
    // select units, to calculate the 'inspired count'
    let unitsAccumulation = await _DB_units.findAll({
      where: {
        used_authorId: targetProject.id,
        author_identity: 'pathProject'
      }
    });
    let unitsList = unitsAccumulation.map((row, index)=> {
      return row.id;
    });
    // then select from inspireds. Still 'findAll' because we need the id list
    let inspireds = await _DB_inspireds.findAll({
      where: {id_unit: unitsList},
      attributes: ['id_user'],
      group: 'id_user',
    });
    let inspiredsPeople = inspireds.map((row,index)=>{
      return row.id_user;
    });
    // select any sub category under the pathProject
    let subCates = await _DB_pathsSubcate.findAll({
      where: {
        id_path: targetProject.id
      }
    });
    let subCatesList = [], subCatesObj = {};
    subCates.forEach((row, index) => {
      subCatesList.push(row.exposedId);
      subCatesObj[row.exposedId] = {
        exposedId: row.exposedId,
        name: row.name,
        description: row.description
      };
    });


    let sendingData={
      pathName: targetProject.pathName,
      name: targetProject.name,
      nodeStart: targetProject.set_nodeStart,
      subCatesInfo: {
        subCatesList: subCatesList,
        subCatesObj: subCatesObj
      },
      otherInfo: {
        webLink: targetProject.set_webLink,
        description: targetProject.description,
        inspiredCount: inspiredsPeople.length,
        inspiredYou: (inspiredsPeople.indexOf(tokenId) < 0) ? false : true
      },
      temp: {}
    };

    _res_success(res, sendingData, "GET: /paths/basic, complete.");
  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return;
  }

}

execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /paths/basic ');
  _handle_GET_paths_basic(req, res);
})

module.exports = execute;
