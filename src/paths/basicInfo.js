const express = require('express');
const execute = express.Router();
const winston = require('../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_paths = require('../../db/models/index').paths;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  notFoundError
} = require('../utils/reserrHandler.js');

async function _handle_GET_paths_basic(req, res){
  const reqPathProject = req.query.pathProject;

  try{
    const targetProject = await _DB_paths.findOne({
      where: {pathName: reqPathProject}
    });
    // if 'null' result -> not a valid pathName
    if(!targetProject){ //'null'
      throw new notFoundError("Project you request was not found. Only a valid path name was allowed.", 52);
      return; //stop and end the handler.
    };

    let sendingData={
      pathName: targetProject.pathName,
      name: targetProject.name,
      nodeStart: targetProject.set_nodeStart,
      otherInfo: {
        webLink: targetProject.set_webLink,
        description: targetProject.description
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
