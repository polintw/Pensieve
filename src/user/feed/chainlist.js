const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_usersNodesHomeland = require('../../../db/models/index').users_nodes_homeland;
const _DB_usersNodesResidence = require('../../../db/models/index').users_nodes_residence;
const {_res_success} = require('../../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
  forbbidenError
} = require('../../utils/reserrHandler.js');


function _handle_GET_feedChainlist(req, res){
  new Promise((resolve, reject)=>{
    const userId = req.extra.tokenUserId;


    selection(baseNode)
    .then((selectResult)=>{
      let usersArr = selectResult.map((row, index)=>{
        return row.id_user;
      });
      let curiousSelect = conditionSelectionChart[curiousCat];

      return curiousSelect(usersArr).catch((err)=>{ throw err});
    })
    .then((result)=>{
      let sendingData={
        nodesList: [],
        temp:{}
      }
      //result was an array of instance of rows of a node
      sendingData.nodesList = result.map((row, index)=>{
        return row.id_node
      });

      resolve(sendingData);
    }).catch((error)=>{
      reject(new internalError(error ,131));
    })
  }).then((sendingData)=>{
    _res_success(res, sendingData, "GET: user feed/chainlist, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: user feed/chainlist.');
  _handle_GET_feedChainlist(req, res);
})

module.exports = execute;
