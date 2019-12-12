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
    let orderify = (`order` in req.query) ? true: false,
        wishedNodeId = req.body.wishList[0];

    _DB_usersDemandMatch.findOne({
      where: {id: userId}
    })
    .then((userRow)=>{
      //check the current length of wishlist
      let prevWishedList = JSON.parse(userRow.list_wished), //it's saved as a 'string'
          newWishedList=[],
          successify;

      async function _update_Wish(){
        await _DB_usersDemandMatch.update(

          {list_inspired: JSON.stringify(mergeList)},  //Important! and remember turn the array into string before update
          {where: {id_user: data.userId}}
        )
      }

      //first, chekc if the node has been wished
      if(prevWishedList.indexOf(wishedNodeId)> -1){ successify = false;}
      else{ //process if the wish is new one
        for(let i=0; i<3; i++){ //loop times equal to desired length no matter the situation
          //seperate into 2 conditions: to 3rd place or not
          if(orderify){
            //if we need to insert to absolute the 3rd place,
            //check if the previous value exist, or insert null to make the length 'grow'
            newWishedList[i] = (i<2)? (!prevWishedList[i])? null : prevWishedList[i] :wishedNodeId;
          }
          else{
            //or if we don't need to insert to 3rd place,
            //just find a empty place (at 1st or 2nd place) and break the loop
            if(!prevWishedList[i]){ newWishedList[i] = wishedNodeId; break;}
            else newWishedList[i] = prevWishedList[i];
          }
        }
        //and, check if we insert successfully
        successify = (newWishedList.indexOf(wishedNodeId) >(-1)) ? true : false;
      }

      if(successify){ //if the new wish was accepted
        return
      }
      else reject(new forbbidenError('unsuccesful insertion to wish list due to length limit or duplicate claim', 121));

    }).catch((err)=>{
      reject(new internalError(err, 131));
    });

  }).then((passedData)=>{
    let sendingData ={ //still declaim one for the requirement of _res_success
      temp:{}
    };

    _res_success(res, sendingData, `'matchNodes, PATCH: /wish' ${req.query.order? 'with query order,': ','} 'complete.'`);
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

module.exports = {
  _handle_PATCH_wish,
  _handle_DELETE_wish
};
