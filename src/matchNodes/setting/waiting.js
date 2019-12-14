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

function _handle_PATCH_waiting(req, res){
  new Promise((resolve, reject)=>{
    const userId = req.extra.tokenUserId;

    const waitingNodeId = req.body.waitingList[0];


    async function _update_list_Waiting( ){

      await _DB_usersDemandMatch.update(
        {list_wished: JSON.stringify(newWishedList)},  //remember turn the array into string before update
        {where: {id_user: userId}}
      ); //sequelize.update() would not return anything (as I know)

      await _DB_nodesDemandMatch.update(
        {list_demand: JSON.stringify(newDemandList)},  //remember turn the array into string before update
        {where: {id_user: userId}}
      ); //sequelize.update() would not return anything (as I know)
    }


    //first, we select the current records of wished list of this user in db
    let selectUserSide = _DB_usersDemandMatch.findOne({
          where: {id_user: userId}}).catch((err)=> {throw err}),
        selectNodeSide = _DB_nodesDemandMatch.findOne({
          where: {
            id_node: waitingNodeId,
            locked: 1 //Important!! this is important to this process, we only allow user 'list' to the node under working
          }}).catch((err)=> {throw err});

    Promise.all([selectUserSide, selectNodeSide])
    .then(([userRow, nodeRow])=>{
      if(!nodeRow) reject(new forbbidenError('reject due to null selection from node match.', 122)); //eliminate the 'null' situation first, which may incl. notexist or not opened to submit

      let prevUserWaiting = JSON.parse(userRow.list_waiting), //it's saved as a 'string'
          prevNodeUsers = JSON.parse(nodeRow.list_waiting),
          //list going to be update if the submit was accepted
          newUserWaiting = prevUserWaiting.slice(),
          newNodeUsers = prevNodeUsers.slice(),
          updateify; //flag used to see if the sumbit was accepted

      //now, start from chekcing if the node has been waiting
      if(prevUserWaiting.indexOf(waitingNodeId)> -1){ updateify = false;}
      else{ //if the node is new one
        newUserWaiting.splice(0, 0, waitingNodeId);
        if(prevNodeUsers.indexOf(waitingNodeId) < 0 ) newNodeUsers.splice(0, 0, waitingNodeId);

        updateify = true ;
      }

      if(updateify){ //if the new wish was accepted

        
        return _update_Wish(newWishedList).catch((err)=>{throw err});
      }
      else reject(new forbbidenError('update to users_/nodes_ demand match fail, due to length limit or node not on the record.', 121));

    }).catch((err)=>{
      reject(new internalError(err, 131));
    });

  }).then(()=>{
    let sendingData ={ //still declaim one for the requirement of _res_success
      temp:{}
    };

    _res_success(res, sendingData, `'matchNodes, PATCH: /wish' ${req.query.order? 'with query order,': ','} 'complete.'`);
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}


function _handle_DELETE_waiting(req, res){
  new Promise((resolve, reject)=>{
    const userId = req.extra.tokenUserId;
    //we only get the Node goint to delete from client
    const unwantedNode = req.body.wishList[0];

    async function _update_list_WishDemand(newWishedList, newDemandList){
      await _DB_usersDemandMatch.update(
        {list_wished: JSON.stringify(newWishedList)},  //remember turn the array into string before update
        {where: {id_user: userId}}
      ); //sequelize.update() would not return anything (as I know)

      await _DB_nodesDemandMatch.update(
        {list_demand: JSON.stringify(newDemandList)},  //remember turn the array into string before update
        {where: {id_user: userId}}
      ); //sequelize.update() would not return anything (as I know)
    }

    let selectUserSide = _DB_usersDemandMatch.findOne({
          where: {id_user: userId}}).catch((err)=> {throw err}),
        selectNodeSide = _DB_nodesDemandMatch.findOne({
          where: {id_node: unwantedNode}}).catch((err)=> {throw err});

    Promise.all([selectUserSide, selectNodeSide])
    .then(([userRow, nodeRow])=>{
      let prevWishedList = JSON.parse(userRow.list_wished), //it's saved as a 'string'
          prevDemandList = JSON.parse(nodeRow.list_demand),
          //list going to be update if the submit was accepted
          newWishedList=[],
          newDemandList = [],
          updateify; //flag used to see if the sumbit was accepted

      //we then check the existence of the node submit by getting the index
      let indexInWished = prevWishedList.indexOf(unwantedNode),
          indexInDemand = prevDemandList.indexOf(userId);
      //prevent malicious req
      if(indexInWished< 0 && indexInDemand< 0){ updateify = false;}
      else{
        newDemandList = (indexInDemand < 0) ? prevDemandList.slice() : prevDemandList.splice(indexInDemand, 1);
        //the wishedlist need to keep it's original length due to the position-specific 'order' value
        //so replace with 'null' when splice
        newWishedList = (indexInWished < 0) ? prevWishedList.slice() : prevWishedList.splice(indexInDemand, 1, null);

        updateify= true;
      }

      if(updateify){
        return _update_list_WishDemand(newWishedList, newDemandList).catch((err)=>{throw err});
      }
      else reject(new forbbidenError('update to users_/nodes_ demand match fail, due to length limit or node not on the record.', 121));

    }).catch((err)=>{
      reject(new internalError(err, 131));
    });

  }).then(()=>{
    let sendingData ={ //still declaim one for the requirement of _res_success
      temp:{}
    };

    _res_success(res, sendingData, `'matchNodes, DELETE: /wish, complete.'`);
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

module.exports = {
  _handle_PATCH_waiting,
  _handle_DELETE_waiting
};
