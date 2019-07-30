const express = require('express');
const execute = express.Router();
//const jwt = require('jsonwebtoken');
//const {verify_key} = require('../../config/jwt.js');
const winston = require('../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_nodesActivity = require('../../db/models/index').nodes_activity;
const _DB_lastvisitIndex = require('../../db/models/index').lastvisit_index;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
} = require('../utils/reserrHandler.js');

function _handle_GET_feed_banner(req, res){
  new Promise((resolve, reject)=>{
    let userId = req.extra.tokenUserId;

    //check and select new ndes used after lastvisit
    /*return _DB_nodesActivity.findAndCountAll({
      where: {
        createdAt: {[Op.gt]: req.query.lastVisit}
      }*/

    //check if this user is first visit after register
    return _DB_lastvisitIndex.findOne({
      where: {
        id_user: userId
      },
      attributes: ['updatedAt', 'createdAt', 'id_user']
    }).then((selected)=>{
      let sendingData={
        greet: '',
        temp: {}
      };

      if(selected.createdAt== req.query.lastVisit){
        //only possible at first time after registration
        sendingData.greet = 'welcomeNew'
      }else{
        let date = new Date();
        let currentCourse = date.getHours();

        if(currentCourse> 17) sendingData.greet = 'greetNight'
        else if(currentCourse> 6 && currentCourse< 11) sendingData.greet = 'greetMorning'
        else sendingData.greet = 'welcomeBack';
      }

      resolve(sendingData);
    }).catch((err)=>{
      reject(new internalError(err, 131));
    });

  }).then((sendingData)=>{
    _res_success(res, sendingData, "feed, GET: /banner, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('feed, GET: /banner ');
  _handle_GET_feed_banner(req, res);
})

module.exports = execute;
