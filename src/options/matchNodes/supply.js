const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_usersDemandMatch = require('../../../db/models/index').users_demand_match;
const _DB_nodesDemandMatch = require('../../../db/models/index').nodes_demand_match;
const {_res_success} = require('../../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
} = require('../../utils/reserrHandler.js');


function _handle_GET_matchNodes_supply(req, res){
  new Promise((resolve, reject)=>{



    const userId = req.extra.tokenUserId;

    _DB_usersDemandMatch.findOne({
      where: {id_user: userId}
    })
    .then((selectResult)=>{
      let nodeTaken = selectResult.taking[0];
      let sendingData ={
        nodesList: [],
        demandCount: null,
        temp:{}
      };

      if(!nodeTaken){
        return sendingData; //if no taking on the record, return to next step directly
      }
      else{
        return _DB_nodesDemandMatch.findOne({
          where: {id_node: nodeTaken}
        })
        .then((nodeRow)=>{
          let demandList = JSON.parse(nodeRow.list_demand),
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
    _res_success(res, sendingData, "Complete, options, GET: /matchNodes/supply.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}


module.exports = _handle_GET_matchNodes_supply;
