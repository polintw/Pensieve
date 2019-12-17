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

    //this api, provide 'menu' currently supplying to the client
    //every node under taken, or every node marks 'supply'

    _DB_nodesDemandMatch.findAndCountAll({
      where: {
        [Op.or]: [
          {locked: 1},
          {supply: 1}]
      }
    })
    .then((selectResult)=>{
      let sendingData ={
        nodesList: [],
        temp:{}
      };
      let nodeRows = selectResult.rows;

      //no matter how many the result is, we just shuffle it to get a random order before the slice pick the number we want
      //random it by 'Fisher-Yates Shuffle'.
      let dealAt = nodeRows.length, tempHolder, randNr;

      while (0 !== dealAt) { //until we go through all list
        randNr = Math.floor(Math.random() * dealAt); //avoid repeatting 'shuffle' the shuffledpart
        dealAt -= 1; //set the index to current one
        //then, shuffle
        tempHolder = nodeRows[dealAt];
        nodeRows[dealAt] = nodeRows[randNr];
        nodeRows[randNr] = tempHolder;
      }
      //now the nodeRows has randomly order. We pick the number we need.
      nodeRows = nodeRows.slice(0, 12); //it would return all items if the length was less

      sendingData.nodesList = nodeRows.map((row, index)=>{
        return row.id_node;
      })

      return sendingData;
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
