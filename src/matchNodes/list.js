const express = require('express');
const execute = express.Router();
const winston = require('../../config/winston.js');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_usersDemandMatch = require('../../db/models/index').users_demand_match;
const _DB_nodesDemandMatch = require('../../db/models/index').nodes_demand_match;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
} = require('../utils/reserrHandler.js');

function _handle_GET_list_userNodes(req, res){
  new Promise((resolve, reject)=>{
    const userId = req.extra.tokenUserId;

    let desiredList;
    switch (req.query.desire) {
      case 'wished':
        desiredList = 'list_wished'
        break;
      case 'willing':
        desiredList = 'list_willing'
        break;
      case 'waiting':
        desiredList = 'list_waited'
        break;
      default:
        desiredList =''
    };

    _DB_usersDemandMatch.findOne({
      where: {id_user: userId}
    }).then((selectResult)=>{
      let sendingData ={
        nodesList: [],
        temp:{}
      };
      sendingData.nodesList = JSON.parse( selectResult[desiredList] );

      resolve(sendingData);
    }).catch((err)=>{
      reject(new internalError(err, 131));
    });

  }).then((sendingData)=>{
    _res_success(res, sendingData, "Complete, matchNodes, GET: /list/user.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}


function _handle_GET_list_taking(req, res){
  new Promise((resolve, reject)=>{
    const userId = req.extra.tokenUserId;

    _DB_usersDemandMatch.findOne({
      where: {id_user: userId}
    })
    .then((selectResult)=>{
      let takenList = JSON.parse(selectResult.taking);
      let sendingData ={
        nodesList: [],
        demandCount: null,
        takingType: selectResult.occupied,
        temp:{}
      };

      if(!takenList[0]){
        return sendingData; //if no taking on the record, return to next step directly
      }
      else{ //and if the takinglist has something, we need to know the 'demand count'
        return _DB_nodesDemandMatch.findOne({
          where: {id_node: takenList[0]}
        })
        .then((nodeRow)=>{
          let demandList = nodeRow.list_demand? JSON.parse(nodeRow.list_demand): [], //in case the list was 'null'
              waitingList = JSON.parse(nodeRow.list_waiting);

          sendingData.nodesList.push(nodeRow.id_node);
          sendingData.demandCount = (demandList.length + waitingList.length);

          return sendingData;
        })
        .catch((err)=>{throw err});
      }

    })
    .then((sendingData)=>{
      //resolve if no rejection
      resolve(sendingData);
    }).catch((err)=>{
      reject(new internalError(err, 131));
    });

  }).then((sendingData)=>{
    _res_success(res, sendingData, "Complete, matchNodes, GET: /list/user.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}


execute.get('/user', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('matchNodes, GET: /list/user');
  _handle_GET_list_userNodes(req, res);
})

execute.get('/taking', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('matchNodes, GET: /list/taking');
  _handle_GET_list_taking(req, res);
})

module.exports = execute;
