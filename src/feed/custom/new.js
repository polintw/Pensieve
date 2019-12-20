const express = require('express');
const execute = express.Router();

const winston = require('../../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_attribution = require('../../../db/models/index').attribution;
const _DB_nodesActivity = require('../../../db/models/index').nodes_activity;
const _DB_usersCustomIndex = require('../../../db/models/index').users_custom_index;
const _DB_usersDemandMatch = require('../../../db/models/index').users_demand_match;
const {_res_success} = require('../../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
} = require('../../utils/reserrHandler.js');

function _handle_GET_feed_customNew(req, res){
  let userId = req.extra.tokenUserId;
  new Promise((resolve, reject)=>{

    _DB_usersCustomIndex.findOne({
      where: {
        id_user: userId
      },
      attributes: ['last_visit', 'currentbelong', 'id_user']
    }).then((usersIndex)=>{
      resolve(usersIndex);
    }).catch((err)=>{
      reject(new internalError(err, 131));
    });
  }).then((usersIndex)=>{
    let pSelectAttri = _DB_attribution.findAndCountAll({
          where: {
            createdAt: {[Op.gt]: usersIndex.last_visit}
          }
        }).catch((err)=>{throw err}),
        pSelectNodesActi = _DB_nodesActivity.findAndCountAll({
          where: {
            createdAt: {[Op.gt]: usersIndex.last_visit}
          }
        }).catch((err)=>{throw err}),
        //in order to pick the Unit related to node user wish or order,
        //select record from users_demand_match
        pSelectUserDemand = _DB_usersDemandMatch.findOne({
          where: {
            id_user: userId
          }
        }).catch((err)=>{throw err});


    return Promise.all([
      pSelectAttri,
      pSelectNodesActi,
      pSelectUserDemand
    ]).then(([newAttri, newNodesActi, userDemand])=>{
      //becuse we still need to use 'usersIndex', so we keep the process in .all()
      let sendingData={
        listCustomNew: [],
        listNew: [],
        temp: {}
      };

      //remember we are using findAndCountAll method
      if(newAttri.count < 0) return sendingData //pass the rest if there is none any new Units.
      else{
        //we are going to determine if the node was on the list user interested,
        //so we create the nodes list of users interest first.
        let nodesWished = JSON.parse(userDemand.list_wished),
            nodesWaited = JSON.parse(userDemand.list_waited),
            unitsObj={};
        let nodesCustom = usersIndex.currentbelong.concat(nodesWished, nodesWaited); //the arr may have duplicate items, but we just tolarate it.
        //then examine each row of attribution, if it was interested by user
        newAttri.rows.forEach((attriRow, index)=>{
          if(nodesCustom.indexOf(attriRow.id_noun) < 0){ sendingData.listNew.push(attriRow.id_unit); return;}; //next round if the node not on the desired list

          if(!(attriRow.id_unit in unitsObj) ){ //only update the one the Unit it represent not yet in the obj, the rest would be gave up now(only the first left)
            unitsObj[attriRow.id_unit] = {
              star: attriRow.id_noun,
              unitId: attriRow.id_unit
            };
          }
        });
        //loop unitsObj to insert them back into sendingData.listCustomNew
        let unitsArr = Object.keys(unitsObj);
        sendingData.listCustomNew = unitsArr.map((key, index)=>{
          return unitsObj[key];
        }); //the listCustomNew was complete.
        //then, check if the listNew has duplicate
        sendingData.listNew = sendingData.listNew.filter((item, index, list)=>{
          return index == list.indexOf(item); //return the '1st' in the list, to rm duplicate
        }); //the listNew was complete.

        return sendingData;

      }
    })
  }).then((sendingData)=>{
    _res_success(res, sendingData, "feed, GET: /custom/new, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

module.exports = _handle_GET_feed_customNew;
