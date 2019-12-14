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



    async function _update_list_Waiting(newNodeUsers, newUserWaited){
      await _DB_usersDemandMatch.update(
        {list_waited: JSON.stringify(newUserWaited)},  //remember turn the array into string before update
        {where: {id_user: userId}}
      ); //sequelize.update() would not return anything (as I know)

      await _DB_nodesDemandMatch.update(
        {list_waiting: JSON.stringify(newNodeUsers)},  //remember turn the array into string before update
        {where: {id_node: waitingNodeId}}
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
          prevNodeTaking = JSON.parse(userRow.taking)//it's saved as a 'string'

      let updateify; //flag used to see if the sumbit was accepted

      //first check, if the user has taken some node.
      if(!userRow.occupied || prevNodeTaking.length > 0 ){ updateify = false;}
      else{ //if the user still available
        updateify = true ;
      }

      if(updateify){ //if the new wish was accepted
        return _update_Taking()
        .then(()=>{
          //resolve if no rejection
          resolve();
        })
        .catch((err)=>{throw err});
      }
      else reject(new forbbidenError(``, 123));

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
    //we only get the Node goint to delete from client
    const unwantedNode = req.body.wishList[0];

    async function _update_list_Waiting(newNodeUsers){
      await _DB_nodesDemandMatch.update(
        {list_waiting: JSON.stringify(newNodeUsers)},  //remember turn the array into string before update
        {where: {id_node: unwantedNode}}
      ); //sequelize.update() would not return anything (as I know)
    }

    //From here, we first select the current records in db,
    //and for DELETE, we only need to modify the list in node demand.
    _DB_nodesDemandMatch.findOne({
      where: {id_node: unwantedNode}
    })
    .then((nodeRow)=>{
      let prevNodeUsers = JSON.parse(nodeRow.list_waiting),
          newNodeUsers = prevNodeUsers.slice();

      let indexInWaiting = prevNodeUsers.indexOf(userId);
      if(indexInWaiting > -1){ //check indexInWaiting in case we can't find the user in the list
         newNodeUsers.splice(indexInWaiting, 1);
         return _update_list_Waiting(newNodeUsers);
      }
      else return; //do nothing if the user was not on the list

    })
    .then(()=>{
      //resolve if no rejection
      resolve();
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
