const express = require('express');
const execute = express.Router();

const winston = require('../../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_nouns = require('../../../db/models/index').nouns;
const _DB_nodesActivity = require('../../../db/models/index').nodes_activity;
const {_res_success} = require('../../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
} = require('../../utils/reserrHandler.js');

function _handle_GET_feed_customTodayNode(req, res){
  new Promise((resolve, reject)=>{
    let userId = req.extra.tokenUserId;

    //we just took 'one' node from used randomly
    _DB_nodesActivity.findOne({
      order: [
        [Sequelize.fn('RAND')] //"RAND" is order for 'random' selection specific for mySQL
      ]
    }).then((result)=>{
      //in this api, we just res the basic info about this selected node
      let sendingData={
        nodesList: [result.id_node],
        nounsBasic: {},
        temp: {}
      }

      return _DB_nouns.findOne({
        where: {
          id: result.id_node
        }
      }).then((resultNouns)=>{
        sendingData.nounsBasic[resultNouns.id]={
          id: resultNouns.id,
          name: resultNouns.name,
          prefix: resultNouns.prefix
        };

        resolve(sendingData);
      }).catch((err)=>{throw err})

    }).catch((err)=>{
      reject(new internalError(err, 131));
    });
  }).then((sendingData)=>{
    _res_success(res, sendingData, "feed, GET: /custom/todayNode, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

module.exports = _handle_GET_feed_customTodayNode;
