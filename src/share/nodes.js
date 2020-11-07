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

async function _handle_GET_shareds_NodesAssigned(req, res){
  const userId = req.extra.tokenUserId; //use userId passed from pass.js

  try{
    // now, there is an issue that the identity of the id_author in units_nodes_assign can't be identified
    // we could only start from units to identfy the author identity
    const usersUnits = await _DB_units.findAll({
      where: {
        id_author: userId,
        author_identity: 'user'
      }
    });
    let unitsList = usersUnits.map((item, index)=>{
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

    _res_success(res, sendingData, "GET: /shareds/nodes, /assigned , complete.");
  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return;
  }

}

execute.get('/assigned', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /shareds/nodes, /assigned ');
  _handle_GET_shareds_NodesAssigned(req, res);
})

module.exports = execute;
