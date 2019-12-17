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

function _handle_PATCH_wish(req, res){
  new Promise((resolve, reject)=>{
    const userId = req.extra.tokenUserId;
    //There are 2 specific info from client,
    //'order' in query, presenting if the req was from the Supply,
    //and wished node(id) in an arr.
    const orderify = (`order` in req.query) ? true: false,
        wishedNodeId = req.body.wishList[0];
    //and prepare the async update if we need to update the wishList & nodes_demand_match
    async function _update_Wish(mergedList){
      //when the function calles, at least we need to update the wishedlist of this user
      await _DB_usersDemandMatch.update(
        {list_wished: JSON.stringify(mergedList)},  //remember turn the array into string before update
        {where: {id_user: userId}}
      ); //sequelize.update() would not return anything (as I know)
      //then, we now check the condition of the wished node--- to see if there was already a records,
      //
      await _DB_nodesDemandMatch.findOrCreate({
        where: {id_node: wishedNodeId},
        defaults: {id_node: wishedNodeId, list_demand: JSON.stringify([userId])}
      })
      .then(([nodeResult, created])=>{
        //when wished from user, we just put him/her into the list
        //that's all, no matter under what kind of condition now
        let demandList = JSON.parse(nodeResult.list_demand);
        if(demandList.indexOf(userId) <0){ //means the record was there in table, so the user would be new one to the list
          demandList.push(userId);
        };

        let updateObj = {
          finished: 0, //this is the only factor need to be assure with the demand list
          list_demand: JSON.stringify(demandList),
        };
        return _DB_nodesDemandMatch.update(
          updateObj,
          {fields: ['finished', 'list_demand']}
        );
      });
    }

    //first, we select the current records of wished list of this user in db
    _DB_usersDemandMatch.findOne({
      where: {id_user: userId}
    })
    .then((userRow)=>{
      let prevWishedList = JSON.parse(userRow.list_wished), //it's saved as a 'string'
          newWishedList=[], //list going to be update if the submit was accepted
          updateify; //flag used to see if the sumbit was accepted

      //now, start from chekcing if the node has been wished
      if(prevWishedList.indexOf(wishedNodeId)> -1){ updateify = false;}
      //process if the wish is new one
      else{
        for(let i=0; i<3; i++){ //loop times equal to desired length no matter the situation
          //seperate into 2 conditions: to 3rd place or not
          if(orderify){
            //if we need to insert to absolute the 3rd place,
            //check if the value ahead exist, or insert null to make the length 'grow'
            newWishedList[i] = (!prevWishedList[i])? (i<2)? null : wishedNodeId: prevWishedList[i]; //only '2' was >2 and <3 in the loop
          }
          else{
            //or if we don't need to insert to 3rd place,
            //just find a empty place (at 1st or 2nd place) and break the loop
            if(!prevWishedList[i]){ newWishedList[i] = wishedNodeId; break;}
            else newWishedList[i] = prevWishedList[i];
          }
        }
        //and, check if we insert successfully
        updateify = (newWishedList.indexOf(wishedNodeId) >(-1)) ? true : false;
      }

      if(updateify){ //if the new wish was accepted
        return _update_Wish(newWishedList).catch((err)=>{throw err});
      }
      else reject(new forbbidenError('update to users_/nodes_ demand match fail, due to length limit or node not on the record.', 121));

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

    _res_success(res, sendingData, `'matchNodes, PATCH: /wish' ${req.query.order? 'with query order,': ','} 'complete.'`);
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}


function _handle_DELETE_wish(req, res){
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
        {
          list_demand: (newDemandList.length == 0) ? null: JSON.stringify(newDemandList)
          //this is a special design for DELET_wish, the demand should return to 'NULL' if the list was empty
          //that's the way to easier the process selecting the nodes have demand.
        },
        {where: {id_node: unwantedNode}}
      ); //sequelize.update() would not return anything (as I know)
    }

    let selectUserSide = _DB_usersDemandMatch.findOne({
          where: {id_user: userId}}).catch((err)=> {throw err}),
        selectNodeSide = _DB_nodesDemandMatch.findOne({
          where: {id_node: unwantedNode}}).catch((err)=> {throw err});

    Promise.all([selectUserSide, selectNodeSide])
    .then(([userRow, nodeRow])=>{
      let prevWishedList = JSON.parse(userRow.list_wished), //it's saved as a 'string'
          prevDemandList = JSON.parse(nodeRow.list_demand);
          //list going to be update if the submit was accepted
      let newWishedList = prevWishedList.slice(),
          newDemandList = prevDemandList.slice(),
          updateify; //flag used to see if the sumbit was accepted

      //we then check the existence of the node submit by getting the index
      let indexInWished = prevWishedList.indexOf(unwantedNode),
          indexInDemand = prevDemandList.indexOf(userId);
      //prevent malicious req
      if(indexInWished< 0 && indexInDemand< 0){ updateify = false;}
      else{
        if(indexInDemand >= 0) newDemandList.splice(indexInDemand, 1);
        //the wishedlist need to keep it's original length due to the position-specific 'order' value
        //so replace with 'null' when splice
        if(indexInWished >= 0) newWishedList.splice(indexInWished, 1, null);

        updateify= true;
      }

      if(updateify){
        return _update_list_WishDemand(newWishedList, newDemandList).catch((err)=>{throw err});
      }
      else reject(new forbbidenError('update to users_/nodes_ demand match fail, due to length limit or node not on the record.', 121));

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

    _res_success(res, sendingData, `'matchNodes, DELETE: /wish, complete.'`);
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

module.exports = {
  _handle_PATCH_wish,
  _handle_DELETE_wish
};
