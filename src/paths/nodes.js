const express = require('express');
const execute = express.Router();
const winston = require('../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_paths = require('../../db/models/index').paths;
const _DB_units = require('../../db/models/index').units;
const _DB_unitsNodesAssign = require('../../db/models/index').units_nodes_assign;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  notFoundError
} = require('../utils/reserrHandler.js');

async function _handle_GET_paths_NodesAssigned(req, res){
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
    // now, there is an issue that the identity of the id_author in units_nodes_assign can't be identified
    // we could only start from units to identfy the author identity
    const projectUnits = await _DB_units.findAll({
      where: {
        id_author: targetProject.id,
        author_identity: 'pathProject'
      }
    });
    let unitsList = projectUnits.map((item, index)=>{
      return item.id;
    });
    const assignedNodes = await _DB_unitsNodesAssign.findAll({
      where: {
        id_unit: unitsList,
      },
      attributes: ["nodeAssigned"],
      group: 'nodeAssigned' // means we combined the rows by nodeAssigned
    });
    let nodesList = assignedNodes.map((nodeRow, index)=>{
      return nodeRow.nodeAssigned;
    })

    let sendingData={
      nodesList: nodesList,
      temp: {}
    };

    _res_success(res, sendingData, "GET: /paths/nodes, /assigned , complete.");
  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return;
  }

}

execute.get('/assigned', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /paths/nodes, /assigned ');
  _handle_GET_paths_NodesAssigned(req, res);
})

module.exports = execute;
