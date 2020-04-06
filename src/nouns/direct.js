const express = require('express');
const execute = express.Router();
const winston = require('../../config/winston.js');
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
} = require('../utils/reserrHandler.js');
const {selectNodesParent} = require('./utils.js');

const _DB_nouns = require('../../db/models/index').nouns;

function _handle_GET_nouns_direct(req, res){
  new Promise((resolve, reject)=>{
    let userId = req.extra.tokenUserId;
    let fetchList = req.query.fetchList;
    if(fetchList.length > 512) fetchList.splice(512); //a security chekc, prevent malicious or accidental req

    selectNodesParent(fetchList)
    .then((nodesInfo)=>{
      let sendingData={
        nodesSeries:{},
        temp: {}
      };

      fetchList.forEach((nodeId, index)=>{ //loop by list client sent
        // for now, if the node passed by client was the top level, no result would be selected in the previous step
        // but we still insert an obj to represent it.
        if(nodeId in nodesInfo){
          let parentList = [], currentNode=nodesInfo[nodeId].parent_id;
          while (!!currentNode) { //jump out until the currentNode(parent_id) was "null" or 'undefined'
            parentList.push(currentNode);
            currentNode = nodesInfo[currentNode].parent_id;
          }
          sendingData.nodesSeries[nodeId] = {
            nodeId: nodesInfo[nodeId].id, //keep the same source as below, all are data came from DB with type 'int'
            topParentId: parentList[(parentList.length-1)],
            listToTop: parentList
          };
        }
        else{
          sendingData.nodesSeries[nodeId] = {nodeId: parseInt(nodeId), topParentId: null, listToTop:[]}; //for now, we keep nodeId in 'int'
        }
      })

      resolve(sendingData);

    }).catch((err)=>{ //catch the error came from the whole
      reject(err);
    });
  }).then((sendingData)=>{
    _res_success(res, sendingData, "GET nouns: /direct, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });

}

execute.get('/', function(req, res){
  if (process.env.NODE_ENV == 'development') winston.verbose('GET nouns: /direct.');
  _handle_GET_nouns_direct(req, res);
})

module.exports = execute;
