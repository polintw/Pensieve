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
        //loopping the newAttri to form an obj contain attri by Unit
        newAttri.rows.forEach((attriRow, index)=>{
          //unitsObj[attriRow.id_unit] should be an {unitId: [nodeId]} format
          if(attriRow.id_unit in unitsObj) unitsObj[attriRow.id_unit].push(attriRow.id_noun)
          else {
            unitsObj[attriRow.id_unit] = [attriRow.id_noun]
          }; //end of 'if()'
        });
        let unitKeys = Object.keys(unitsObj); //an arr contain all Unit id
        unitKeys.forEach((key, index)=>{
          let toCustom = false; //token to determine in list custom or not
          for(let i=0; i< unitsObj[key].length; i++){ //loopping all nodes used by this Unit(by key)
            if(nodesCustom.indexOf(unitsObj[key][i]) > (-1)){ //if the node was one of the user insterested
              sendingData.listCustomNew.push({
                star: unitsObj[key][i],
                unitId: key
              });
              toCustom = true;
              break; //break the for loop, going to next Unit, no matter how many node remaining.
            };
          }
          if(!toCustom) sendingData.listNew.push(key); //means the Unit do not have any node interested by user.
        });

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
