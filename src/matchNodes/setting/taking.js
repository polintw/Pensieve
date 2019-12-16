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

function _handle_POST_taking(req, res){
  new Promise((resolve, reject)=>{
    const userId = req.extra.tokenUserId;

    const takingNodeId = req.body.takingList[0];

    async function _update_Taking(newTakingUser){
      let date = new Date(); // for lockedAt
      await _DB_usersDemandMatch.update(
        {
          taking: JSON.stringify([takingNodeId]),
          occupied: 1
        },  //remember turn the array into string before update
        {where: {id_user: userId}}
      ); //sequelize.update() would not return anything (as I know)

      await _DB_nodesDemandMatch.update(
        { //update the field as the switch chart
          list_taking: JSON.stringify(newTakingUser),
          locked: 1,
          lockedAt: date.getTime(),
          finished: 0,
          supply: 0
        },  //remember turn the array into string before update
        {where: {id_node: takingNodeId}}
      ); //sequelize.update() would not return anything (as I know)
    }

    //From here, select current records,
    //to judge if the submit should be accept.
    let selectUserSide = _DB_usersDemandMatch.findOne({
          where: {id_user: userId}}).catch((err)=> {throw err}),
        selectNodeSide = _DB_nodesDemandMatch.findOne({
          where: {id_node: takingNodeId}}).catch((err)=> {throw err});

    Promise.all([selectUserSide, selectNodeSide])
    .then(([userRow, nodeRow])=>{
      //eliminate the 'null' situation first, which may incl. notexist or not opened to submit
      if(!nodeRow){ reject(new forbbidenError(`reject due to null selection from node match modification during ${"taking" }process.`, 122)); return }; //return to break the promise

      let prevTakingUser = JSON.parse(nodeRow.list_taking),
          prevNodeTaking = JSON.parse(userRow.taking); //it's saved as a 'string'
      let newTakingUser = prevTakingUser.slice();
          updateify; //flag used to see if the sumbit was accepted

      //first check, if the user has taken some node.
      if(!userRow.occupied || prevNodeTaking.length > 0 ){ updateify = false;}
      else{ //if the user still available
        //make a new taking list for the node base on current list
        if(newTakingUser.indexOf(userId) < 0) newTakingUser.push(userId); //check just in case the list somehow has already had the user
        updateify = true ;
      }

      if(updateify){ //if the new wish was accepted
        return _update_Taking(newTakingUser)
        .then(()=>{
          //resolve if no rejection
          resolve();
        })
        .catch((err)=>{throw err});
      }
      else reject(new forbbidenError(`reject due to the user has duplicate claim to the taking node.`, 123));

    }).catch((err)=>{
      reject(new internalError(err, 131));
    });

  }).then(()=>{
    let sendingData ={ //still declaim one for the requirement of _res_success
      temp:{}
    };

    _res_success(res, sendingData, `matchNodes, POST: /taking, complete`);
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}


function _handle_DELETE_taking(req, res){
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
        if(newTakingUser.length == 0){ //user was the last one before splice()
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
  _handle_POST_taking,
  _handle_DELETE_taking
};
