const express = require('express');
const execute = express.Router();
const winston = require('../../config/winston.js');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_nodesDemandMatch = require('../../db/models/index').nodes_demand_match;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
} = require('../utils/reserrHandler.js');

function _handle_GET_status_node(req, res){
  new Promise((resolve, reject)=>{
    const userId = req.extra.tokenUserId;

    //client would req many nodes in one req, from wished list to supply.
    let reqNodesList = JSON.parse(req.query.nodesList); //remember, parse it because it was a string.
    _DB_nodesDemandMatch.findAll({
      where: {id_node: reqNodesList},
      limit: 10 //Notice! it is for the malicious req, but should always follow the requirement design for front end
    }).then((selectResult)=>{
      let sendingData = {
        listObj: {},
        temp: []
      };

      selectResult.forEach((row, index)=>{
        let value;
        switch (req.query.interest) { //define value by the clien't interest
          case 'taken':
            value = !!row.locked;
            break;
          case 'finished':
            value = !!row.finished;
            break;
          case 'supply':
            value = !!row.supply; //0 or null would be turn into 'true'
            break;
          case 'demand':{
            let demandList = row.list_demand? JSON.parse(row.list_demand): []; //in case the list was 'null'
            value = demandList.length;
            break;
          }
          default:
            value = false;
        }

        sendingData.listObj[row.id_node] = value;
      })

      resolve(sendingData);
    }).catch((err)=>{
      reject(new internalError(err, 131));
    });
  }).then((sendingData)=>{
    _res_success(res, sendingData, "Complete, matchNodes, GET: /status/node.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}


execute.get('/node', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('matchNodes, GET: /status/node');
  _handle_GET_status_node(req, res)
})

module.exports = execute;
