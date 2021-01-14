const express = require('express');
const execute = express.Router();
const winston = require('../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_nodesAssigned = require('../../db/models/index').units_nodes_assign;
const _DB_nodesLocation = require('../../db/models/index').nodes_locationAdmin;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  notFoundError
} = require('../utils/reserrHandler.js');

async function _handle_GET_nouns_Assigned(req, res){
  try{
    const allAssignedNodes = await _DB_nodesAssigned.findAll({
      attributes: ['nodeAssigned'],
      group: 'nodeAssigned'
    });
    let assignedNodesList = allAssignedNodes.map((row, index)=> {
      return row.nodeAssigned;
    });
    let assignedNodesLocation = 
    if(!!req.query.map){
      assignedNodesLocation = await _DB_nodesLocation.findAll({
        where: {

        }
      })
    };

    let sendingData={
      nodesList: assignedNodesList,
      nodesDataList: [],
      temp: {}
    };

    llAssignedNodes.forEach((row, index) => {
      sendingData.nodesList.push(row.nodeAssigned);

    });

    _res_success(res, sendingData, "GET: /nouns/assigned, complete.");
  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return;
  }

}

execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /nouns/assigned.');
  _handle_GET_nouns_Assigned(req, res);
})

module.exports = execute;
