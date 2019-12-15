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
  forbbidenError
} = require('../../utils/reserrHandler.js');

function _handle_PATCH_willing(req, res){
  new Promise((resolve, reject)=>{
    const userId = req.extra.tokenUserId;

    const willingNodeId = req.body.willingList[0];

    async function _update_Willing(updateUser, updateNode){
      await _DB_usersDemandMatch.update(
        updateUser,
        {where: {id_user: userId}}
      ); //sequelize.update() would not return anything (as I know)

      await _DB_nodesDemandMatch.update(
        updateNode,
        {where: {id_node: takingNodeId}}
      ); //sequelize.update() would not return anything (as I know)
    }

    //From here, select current records,
    //to judge if the submit should be accept.
    let selectUserSide = _DB_usersDemandMatch.findOne({
          where: {id_user: userId}}).catch((err)=> {throw err}),
        //for willing, create directly if the node not in the table yet
        selectNodeSide = _DB_nodesDemandMatch.findOrCreate({
          where: {id_node: willingNodeId},
          defaults: {id_node: willingNodeId, list_willing: '[]', supply: 1} //keep the list_willing empty, insert the content later
        }).catch((err)=> {throw err});

    Promise.all([selectUserSide, selectNodeSide])
    .then(([userRow, nodeRow])=>{
      //2 things: willing no more than 5, and if the user is 'available'
      let prevWillingNode = JSON.parse(userRow.list_willing),
          prevTakingNodes = JSON.parse(userRow.taking),
          prevWillingList = JSON.parse(nodeRow.list_willing),
          prevDemandUsers = JSON.parse(nodeRow.list_demand),
          prevTakingUsers = JSON.parse(nodeRow.list_taking);
      let newWillingNode = prevWillingNode.slice(),
          newWillingList = prevWillingList.slice(),
          updateNode = {}, //obj for node match
          updateUser = {}, //obj for user match
          updateify; //flag used to see if the sumbit was accepted

      //check the user's current list of willing to distinguish accepted or not.
      let indexToNode = prevWillingNode.indexOf(willingNodeId),
          indexToUser = prevWillingList.indexOf(userId);
      if( indexToNode > (-1) || prevWillingNode.length =5 ){ updateify = false;}
      else{ //if the list still available
        newWillingNode.push(willingNodeId); //add the new node to user's list
        if( indexToUser <0) newWillingList.push(userId); //in case somehow the list has already had the user

        updateUser['list_willing'] = JSON.stringify(newWillingNode);
        updateNode['list_willing'] = JSON.stringify(newWillingList); //add the user to the node's list
        if( prevDemandUsers.length > 0 && prevTakingNodes.length = 0){
          //the node has demand, and the user did not be occupied,
          //if so, the willing will statrt a 'locked' cycle directly,
          //the user would take the node automatically

          if(prevTakingUsers.indexOf(userId) >(-1)) prevTakingUsers.push(userId);
          let userObj = {
                occupied: 1,
                taking: JSON.stringify([willingNodeId])
              },
              nodeObj = {
                locked: 1,
                finished: 0,
                supply: 0,
                list_taking: JSON.stringify(prevTakingUsers)
              };

          Object.assign(updateUser, userObj);
          Object.assign(updateNode, nodeObj);
        }

        updateify = true ;
      }

      if(updateify){ //if the new wish was accepted
        return _update_Willing(updateUser, updateNode)
        .then(()=>{
          //resolve if no rejection
          resolve();
        })
        .catch((err)=>{throw err});
      }
      else reject(new forbbidenError(`reject due to the willing list was full or duplicate claim.`, 124));

    }).catch((err)=>{
      reject(new internalError(err, 131));
    });

  }).then(()=>{
    let sendingData ={ //still declaim one for the requirement of _res_success
      temp:{}
    };

    _res_success(res, sendingData, `matchNodes, PATCH: /willing, complete`);
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}


function _handle_DELETE_willing(req, res){
  new Promise((resolve, reject)=>{
    const userId = req.extra.tokenUserId;

    const submitNodeId = req.body.takingList[0];

    async function _update_Taking(updateObj){
      await _DB_usersDemandMatch.update(
        {
          taking: "[]",
          occupied: 0
        },  //remember turn the array into string before update
        {where: {id_user: userId}}
      ); //sequelize.update() would not return anything (as I know)

      await _DB_nodesDemandMatch.update(
        updateObj,
        {where: {id_node: submitNodeId}}
      ); //sequelize.update() would not return anything (as I know)
    }

    //From here, select current records,
    //to judge if the submit should be accept.
    let selectUserSide = _DB_usersDemandMatch.findOne({
          where: {id_user: userId}}).catch((err)=> {throw err}),
        selectNodeSide = _DB_nodesDemandMatch.findOne({
          where: {id_node: submitNodeId}}).catch((err)=> {throw err});

    Promise.all([selectUserSide, selectNodeSide])
    .then(([userRow, nodeRow])=>{
      //eliminate the 'null' situation first, which may incl. notexist or not opened to submit
      if(!nodeRow){ reject(new forbbidenError(`reject due to null selection from node match modification during ${"DELETE taking" }process.`, 122)); return }; //return to break the promise

      let prevTakingUser = JSON.parse(nodeRow.list_taking),
          prevNodeTaking = JSON.parse(userRow.taking); //it's saved as a 'string'
      let newTakingUser = prevTakingUser.slice(),
          updateObj = {}, //obj for node match
          updateify; //flag used to see if the sumbit was accepted

      //then for DELETE, the importantance is at if the user really is working on this node,
      //that's what we are going to check first
      if( prevNodeTaking.indexOf(submitNodeId)< 0 ){ updateify = false;}
      else{ //if the user is really working on the node now
        let indexInTaking = prevTakingUser.indexOf(userId);
        if(indexInTaking >(-1)) newTakingUser.splice(indexInTaking, 1); //in case somehow the user is not on the list
        //the only thing need to distinguish is if the user was the last one one the taking list
        updateObj["list_taking"] = JSON.stringify(newTakingUser);
        if(newTakingUser.length = 0){ //user was the last one before splice()
          updateObj['locked'] = 0;
          updateObj['supply'] = (nodeRow.list_willing> 0) ? 1: 0;
          updateObj['list_waiting'] = "[]"; //no one was working on this node, clean all users waiting
        };

        updateify = true ;
      }

      if(updateify){ //if the new wish was accepted
        return _update_Taking(updateObj)
        .then(()=>{
          //resolve if no rejection
          resolve();
        })
        .catch((err)=>{throw err});
      }
      else reject(new forbbidenError(`reject due to trying to use unmatch node deleting the taken one.`, 123));

    }).catch((err)=>{
      reject(new internalError(err, 131));
    });

  }).then(()=>{
    let sendingData ={ //still declaim one for the requirement of _res_success
      temp:{}
    };

    _res_success(res, sendingData, `matchNodes, DELETE: /taking, complete.`);
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

module.exports = {
  _handle_PATCH_willing,
  _handle_DELETE_willing
};
