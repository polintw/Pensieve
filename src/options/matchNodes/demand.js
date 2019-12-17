const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_nodesDemandMatch = require('../../../db/models/index').nodes_demand_match;
const {_res_success} = require('../../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
} = require('../../utils/reserrHandler.js');


function _handle_GET_matchNodes_demand(req, res){
  new Promise((resolve, reject)=>{
    const userId = req.extra.tokenUserId;

    //this api, provide the client selected demand list

    _DB_nodesDemandMatch.findAll({
      where: {
        [Op.ne]: null
      },
      order: [
        [Sequelize.fn('RAND')] //"RAND" is order for 'random' selection specific for mySQL
      ],
      limit: 24
    })
    .then((selectResult)=>{
      let sendingData ={
        nodesList: [],
        temp:{}
      };

      //for now, the list is simply a randomly formed, with solid length limit.
      sendingData.nodesList = selectResult.map((row, index)=>{
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
    _res_success(res, sendingData, "Complete, options, GET: /matchNodes/demand.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}


module.exports = _handle_GET_matchNodes_demand;
