const express = require('express');
const execute = express.Router();

const winston = require('../../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_nouns = require('../../../db/models/index').nouns;
const _DB_daily = require('../../../db/models/index').daily;
const _DB_nodesActivity = require('../../../db/models/index').nodes_activity;
const {_res_success} = require('../../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
} = require('../../utils/reserrHandler.js');

function _handle_GET_feed_customTodayNode(req, res){
  new Promise((resolve, reject)=>{
    const userId = req.extra.tokenUserId;

    //currently, we change the todayNode 'daily'
    //we should check if the node has already prepared from table daily,
    //or should we update today's choice in this apt
    _DB_daily.findOne({
      //we need, the 'last one'
      limit: 1,
      order: [['day', 'DESC']] //make sure the order of arr are from latest
    })
    .then((resultDaily)=>{
      const now = new Date(); //start from knowing what date is tody
      const lastRecord = new Date(Boolean(resultDaily)? resultDaily.day:'2019-11-15'); //time obj for the last record in daily
      //and don't forget a special condition that we select 'nothing',
      //which actually only happened at the very beginning of the table
      let nowDate = now.getDate(),
          nowMonth = now.getMonth()+1,
          nowYear = now.getFullYear(), //actually, there should not have any chance for different 'year', but~
          recDate = lastRecord.getDate(),
          recMonth = lastRecord.getMonth()+1,
          recYear = lastRecord.getFullYear();

       //compare the date, if not equal(not the same day), we make a new by randomly pick from nodes_activity
      if(!(nowDate==recDate && nowMonth==recMonth && nowYear==recYear)){
        //we just took 'one' node from used randomly
        return _DB_nodesActivity.findOne({
          order: [
            [Sequelize.fn('RAND')] //"RAND" is order for 'random' selection specific for mySQL
          ]
        })
        .then((resultRand)=>{
          return _DB_daily.create({
            focus_node: resultRand.id_node
          })
        })
        .then((createLast)=>{
          return createLast.focus_node; // in the end, return the node id from the row we just created to daily
        })
      }else return resultDaily.focus_node;

    }).then((nodeId)=>{
      //in this api, we just res the basic info about this selected node
      let sendingData={
        nodesList: [nodeId],
        nounsBasic: {},
        temp: {}
      }

      return _DB_nouns.findOne({
        where: {
          id: nodeId
        }
      }).then((resultNouns)=>{
        sendingData.nounsBasic[resultNouns.id]={
          id: resultNouns.id,
          name: resultNouns.name,
          prefix: resultNouns.prefix
        };

        resolve(sendingData);
      })

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
