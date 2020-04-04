const express = require('express');
const execute = express.Router();
const winston = require('../../config/winston.js');
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
} = require('../utils/reserrHandler.js');

const _DB_nouns = require('../../db/models/index').nouns;

function _handle_GET_nouns_direct(req, res){
  new Promise((resolve, reject)=>{
    let userId = req.extra.tokenUserId;
    let fetchList = req.query.fetchList;
    if(fetchList.length > 512) fetchList.splice(512); //a security chekc, prevent malicious or accidental req

    async function selectNodesParent(initList){
      let nodesInfo = {};
      let targetList=initList.slice(); //shallow copy, prevent modifying initList
      /*
      The concept is, we INNER JOIN table nouns to itself everytime,
      to select the child + parent,
      then by while, we check if parent has parent,
      select until the parent was the top level.
      this way is only decrease 1 cycle compare to select one by one after each relationship was checked.
      */
      while (targetList.length > 0) {
        await _DB_nouns.findAll({
          where: {id: targetList},
          include: { //this is worked by comprehensive setting for 'association' --- foreign key between 2 including table(even a foreign key to self )
            model: _DB_nouns,
            as: 'nouns2',
            required: true
          }
        })
        .then((results)=>{
          targetList= []; // no matter what reaons, clean the list first to see if there are any candidate going to next round
          results.forEach((row, index) => {
            nodesInfo[row.id]={
              id: row.id,
              parent_id: row.parent_id
            };
            nodesInfo[row.nouns2.id]={
              id: row.nouns2.id,
              parent_id: row.nouns2.parent_id //could be null
            };
            //"do we need the next round?"
            if(row.nouns2.child && !!row.nouns2.parent_id) targetList.push( row.nouns2.id); //push back to list if stiil has parent going to get
          });
        });
      }; //end of while

      return (nodesInfo);
    };

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
            nodeId: nodeId,
            topParentId: parentList[(parentList.length-1)],
            listToTop: parentList
          };
        }
        else{
          sendingData.nodesSeries[nodeId] = {nodeId: nodeId, topParentId: null, listToTop:[]};
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
