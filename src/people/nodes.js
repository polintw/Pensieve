const express = require('express');
const execute = express.Router();
const winston = require('../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_users = require('../../db/models/index').users;
const _DB_units = require('../../db/models/index').units;
const _DB_unitsNodesAssign = require('../../db/models/index').units_nodes_assign;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  notFoundError
} = require('../utils/reserrHandler.js');

async function _handle_GET_people_NodesAssigned(req, res){
  const reqUserId = req.query.userId;

  try{
    // validation: if the user id was valid
    const targetUser = await _DB_users.findOne({
      where: {id: reqUserId}
    });
    // if 'null' result -> not a valid pathName
    if(!targetUser){ //'null'
      throw new notFoundError("User you request was not found. Please use a valid user id.", 50);
      return; //stop and end the handler.
    };
    // now, there is an issue that the identity of the id_author in units_nodes_assign can't be identified
    // we could only start from units to identfy the author identity
    const usersUnits = await _DB_units.findAll({
      where: {
        id_author: targetUser.id,
        author_identity: 'user'
      }
    });
    let unitsList = usersUnits.map((item, index)=>{
      return item.id;
    });
    let nodesList = [];
    if(!!req.query.suggestion){ // if we are return list for suggestions used in NavFIlter, only return
      let assignedNodes = await _DB_unitsNodesAssign.findAll({
        where: {
          id_unit: unitsList,
        },
        attributes: ["nodeAssigned", "createdAt"],
        order: [ //make sure the order of arr are from latest
          Sequelize.literal('`createdAt` DESC') //and here, using 'literal' is due to some wierd behavior of sequelize,
          //it would make an Error if we provide col name by 'arr'
        ]
      });
      for(let i=0 ; i< assignedNodes.length ; i++){
        if(nodesList.length > 7) break;
        if(nodesList.indexOf(assignedNodes[i].nodeAssigned) < 0){
          nodesList.push(assignedNodes[i].nodeAssigned);
        };
      };
    }
    else{
      let assignedNodes = await _DB_unitsNodesAssign.findAll({
        where: {
          id_unit: unitsList,
        },
        attributes: ["nodeAssigned"],
        group: 'nodeAssigned' // means we combined the rows by nodeAssigned
      });
      nodesList = assignedNodes.map((nodeRow, index)=>{
        return nodeRow.nodeAssigned;
      });
    };

    let sendingData={
      nodesList: nodesList,
      temp: {}
    };

    _res_success(res, sendingData, "GET: /people/nodes, /assigned , complete.");
  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return;
  }

}

execute.get('/assigned', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /people/nodes, /assigned ');
  _handle_GET_people_NodesAssigned(req, res);
})

module.exports = execute;
