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

const categoryAll = ["residence", "homeland"];

const _findandcount_fromHomeland_All = (nodeId)=>{
  return _DB_usersNodesHomeland.findAndCountAll({
    where: {
      id_node: nodeId,
      historyify: false
    },
  })
  .then((result)=>{
    return result;
  })
  .catch((err)=>{ throw err })
};
const _findandcount_fromResidence_All = (nodeId)=>{
  return _DB_usersNodesResidence.findAndCountAll({
    where: {
      id_node: nodeId,
      historyify: false
    },
  })
  .then((result)=>{
    return result;
  })
  .catch((err)=>{ throw err })
};

function _handle_GET_nounCount_users(req, res){
  new Promise((resolve, reject)=>{
    const userId = req.extra.tokenUserId;
    const baseNode = req.reqNounId;
    const arrSelectionList = [ //the order has to match the params in the categoryAll
      new Promise((resolve, reject)=>{resolve(_findandcount_fromResidence_All(baseNode));}),
      new Promise((resolve, reject)=>{resolve(_findandcount_fromHomeland_All(baseNode));})
    ];

    const limitCorner = !!req.query.limitCorner ? req.query.limitCorner: false; // 'str' if true
    const countCat = !!req.query.countCat ? req.query.countCat: false; // [] if true

    let processedCat = [categoryAll];
    let arrPromiseList = arrSelectionList;

    if(countCat) {
      //'delete': rm the category & repectively promise not in the countCat
      arrSelectionList.forEach((p, index) => {
        if(countCat.indexOf(categoryAll[index]) <0){
          arrPromiseList.splice(index, 1);
          processedCat.splice(index, 1);
        }
      });
    };
    if(limitCorner) {
      /*
        Actually, we should use a selection with 'JOIN' if there were any limitCorner.
        Have to: add join param into selection, let the selection use the parmas obj passed.
        Rm the second selection beneath if the new method was est.
      */
    };


    Promise.all(arrPromiseList)
    .then((results)=>{
      let sendingData={
        countsByTypes: {},
        temp:{}
      }
      //remember we using the 'findAndCountAll'
      if(countCat){ //not 'all' situation, have to separate.
        processedCat.forEach((category, index) => {
          sendingData.countsByTypes[category] = results.count
        });
      }
      else{ // every category were included, no need to separate.
        let countTotal = 0;
        for(let i=0; i< results.length; i++){
          countTotal += results[i].count;
        }
        sendingData.countsByTypes["all"] = countTotal;
      }



      resolve(sendingData);
    }).catch((error)=>{
      reject(new internalError(error ,131));
    })
  }).then((sendingData)=>{
    _res_success(res, sendingData, "GET: /nouns/:id/count, users, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

module.exports = {
  _handle_GET_nounCount_users
};
