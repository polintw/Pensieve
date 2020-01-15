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


function _handle_GET_matchNodes_demand(req, res){
  new Promise((resolve, reject)=>{
    const userId = req.extra.tokenUserId;

    //this api, provide the client selected demand list

    let selectUserSide = _DB_usersDemandMatch.findOne({
          where: {id_user: userId}}).catch((err)=> {throw err}),
        selectNodeSide = _DB_nodesDemandMatch.findAll({
          where: {
            list_demand: {[Op.ne]: null}
          },
          order: [
            [Sequelize.fn('RAND')] //"RAND" is order for 'random' selection specific for mySQL
          ],
          limit: 24
        }).catch((err)=> {throw err});

    Promise.all([selectUserSide, selectNodeSide])
    .then(([userRow, nodeRows])=>{
      let sendingData ={
        nodesList: [],
        temp:{}
      };
      let prevWishedList = JSON.parse(userRow.list_wished),
          prevWillingList = JSON.parse(userRow.list_willing);

      //then for now, we decide 'not to incl.' the nodes wished or suppy by the user him/her-self
      nodeRows.forEach((row, index)=>{
        if(prevWishedList.indexOf(row.id_node) < 0 && prevWillingList.indexOf(row.id_node) < 0){
          sendingData.nodesList.push(row.id_node);}
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
