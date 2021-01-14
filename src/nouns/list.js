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
      group: 'nodeAssigned',
      limit: 1200 // temp rule
    });
    let assignedNodesList = allAssignedNodes.map((row, index)=> {
      return row.nodeAssigned;
    });
    let sendingData={
      nodesList: assignedNodesList,
      nodesDataList: [],
      temp: {}
    };
    // res based on query
    if(!!req.query.map){
      let nodesDataLocation = await _DB_nodesLocation.findAll({
        where: {
          id_node: sendingData.nodesList,
          category: 'location_admin'
        }
      });
      sendingData.nodesDataList = nodesDataLocation.map((row, index)=>{
        return ({
          nodeId: row.id_node,
          coordinates: [row.location_lat, row.location_lon],
        })
      });

      _res_success(res, sendingData, "GET: /nouns/list, /assigned, complete.");
    }
    else{
      _res_success(res, sendingData, "GET: /nouns/list, /assigned, complete.");
    };
  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return;
  }
}

execute.get('/assigned', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /nouns/list, /assigned.');
  _handle_GET_nouns_Assigned(req, res);
})

module.exports = execute;
