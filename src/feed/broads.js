const express = require('express');
const execute = express.Router();
const jwt = require('jsonwebtoken');
const winston = require('../../config/winston.js');
const {verify_key} = require('../../config/jwt.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_broads = require('../../db/models/index').broads;
const _DB_usersCustomIndex = require('../../db/models/index').users_custom_index;
const {_res_success} = require('../utils/resHandler.js');
const {
  _select_Basic
} = require('../utils/dbSelectHandler.js');
const {
  _handle_ErrCatched,
  internalError,
} = require('../utils/reserrHandler.js');

function _handle_GET_feed_mainBroads(req, res){
  new Promise((resolve, reject)=>{
    const userId = req.extra.tokenUserId;

    _DB_usersCustomIndex.findOne({
      where: {
        id_user: userId
      },
      attributes: ['last_visit', 'id_user']
    }).then((usersIndex)=>{
      //then we select the list
      return _DB_broads.findAll({
        where: {
          createdAt: {[Op.gt]: usersIndex.last_visit}
        },
        limit: 12, //just in case there are too many, the client would use not more than 12
        order: [['createdAt', 'DESC']] //make sure the order of arr are from latest
      }).catch((err)=>{throw err});
    })
    .then((latestBroads)=>{
      let sendingData={
        unitsList: [],
        temp: {}
      };

      latestBroads.forEach((row, index)=>{
        sendingData.unitsList.unshift(latestBroads.id_unit)
      })

      return sendingData;
    })
    .then((sendingData)=>{
      //But now! it is possible none of units was broaded since last_visit,
      //so we check the length now, and if the units less than 3 (the smallest num display on client side),
      //we pick from the old, unless, there are 'nothing' in the table(only happen at the beginging)
      const remainLength = 3-sendingData.unitsList.length;
      if(remainLength> 0){
        return _DB_broads.findAndCountAll({
          where:{
            createdAt: {[Op.lt]: usersIndex.last_visit}
          },
          limit: 23, //just a num conerning the later Fisher-Yates shuffle
          order: [['createdAt', 'DESC']] //make sure the order of arr are from latest
        })
        .then((resultBroads)=>{
          //now, we want to randomly select nums from it. Also use 'Fisher-Yates Shuffle'.
          let dealAt = resultBroads.length, tempHolder, randNr;

          while (0 !== dealAt) { //until we go through all list
            randNr = Math.floor(Math.random() * dealAt); //avoid repeatting 'shuffle' the shuffledpart
            dealAt -= 1; //set the index to current one
            //then, shuffle
            tempHolder = resultBroads[dealAt];
            resultBroads[dealAt] = resultBroads[randNr];
            resultBroads[randNr] = tempHolder;
          };
          //and final, pick the needed amount from the random arr
          for(let i=0; i< remainLength; i++){
            sendingData.unitsList.push(resultBroads[i].id_unit);
          };

          return sendingData
        }).catch((err)=>{throw err});
      }
      //or if we got enough units at previous step
      else return sendingData; //end of 'if'
    }).then((sendingData)=>{

      resolve(sendingData);
    }).catch((err)=>{
      reject(new internalError(err, 131));
    });
  }).then((sendingData)=>{
    _res_success(res, sendingData, "Complete, GET: /feed/broads.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /feed/broads ');
  _handle_GET_feed_mainBroads(req, res);
})

module.exports = execute;
