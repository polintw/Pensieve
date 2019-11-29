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
        //no 'limit', so it is dangerous if the broad accumulated too many
        order: [['createdAt', 'DESC']] //make sure the order of arr are from latest
      })
      .then((latestBroads)=>{
        let sendingData={
          unitsList: [],
          temp: {}
        };
        latestBroads.forEach((row, index)=>{
          //the list, could have duplicate unit because the same unit would be broad many times
          //and we could not just filter it during selection by native mysql(DISTINCT), because the 'createdAt' is almost unique for each row
          //so, we have to rm duplicate value
          if(sendingData.unitsList.indexOf(latestBroads.id_unit)< 0) sendingData.unitsList.unshift(latestBroads.id_unit);
        })

        sendingData.temp["last_visit"] = usersIndex.last_visit; //for the possible situation in next step

        return sendingData;
      })
      .catch((err)=>{throw err});
    })
    .then((sendingData)=>{
      //But now! it is possible none of units was broaded since last_visit,
      //so we check the length now, and if the units less than 3 (the smallest num display on client side),
      //we pick from the old, unless, there are 'nothing' in the table(only happen at the beginging)
      const remainLength = 3-sendingData.unitsList.length;
      if(remainLength> 0){
        return _DB_broads.findAll({
          attributes: [
            [Sequelize.fn('DISTINCT', Sequelize.col('id_unit')) ,'id_unit']
          ],
          limit: 113, //just a num conerning the later Fisher-Yates shuffle
          //Notice! this selection, is just a method work for current situation
          //the 'limit' + 'DISTINCT' would be unrealistic after the frequency of broad raise
          //we would need a better algorithm for this list after the future came
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
