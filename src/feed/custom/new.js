const express = require('express');
const execute = express.Router();

const winston = require('../../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_attribution = require('../../db/models/index').attribution;
const _DB_nodesActivity = require('../../../db/models/index').nodes_activity;
const _DB_usersCustomIndex = require('../../../db/models/index').users_custom_index;
const {_res_success} = require('../../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
} = require('../../utils/reserrHandler.js');

function _handle_GET_feed_customNew(req, res){
  new Promise((resolve, reject)=>{
    let userId = req.extra.tokenUserId;

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
            createdAt: [Op.gt]: usersIndex.last_visit
          }
        }).catch((err)=>{throw err}),
        pSelectNodesActi = _DB_nodesActivity.findAndCountAll({
          where: {
            createdAt: [Op.gt]: usersIndex.last_visit
          }
        }).catch((err)=>{throw err});

    return Promise.all([
      pSelectAttri,
      pSelectNodesActi
    ]).then(([newAttri, newNodesActi])=>{
      //becuse we still need to use 'usersIndex', so we keep the process in .all()
      let sendingData={
        listBelong: [],
        listFirst: [],
        commonList: [],
        temp: {}
      };

      //remember we are using findAndCountAll method
      if(newAttri.count < 0){ return sendingData;} //pass the rest if there is none any new Units.
      else
      //first, check if there is any new Unit match the belong nodes
      for(let i= (newAttri.rows.length-1) ; i >= 0 ; i--){ //because we need to splice the row if match,
        //we count down from the end, to assure the index is work
        let row = newAttri.rows[i];
        if(usersIndex.currentbelong.indexOf(row.id_noun) >= 0) {
          if(sendingData.listBelong.indexOf(row.id_unit) < 0) sendingData.listBelong.push(row.id_unit); // which means skipping the already count in Unit
          newAttri.rows.splice(i, 1);
        }
      }
      //next, check if any new Nodes used, and if the Unit used it still on the list
      //confirm the length after the list form

    })

  }).then((sendingData)=>{
    _res_success(res, sendingData, "feed, GET: /custom/new, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

module.exports = _handle_GET_feed_customNew;
