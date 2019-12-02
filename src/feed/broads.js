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
        //the list, could have duplicate unit because the same unit would be broad many times
        //so we trying to select & filter the row with same id_unit here
        attributes: [
          //'max' here combined with 'group' prop beneath,
          //because the GROUP by won't deal with the createdAt at the same time with id_unit,
          //so we ask only the 'max' one by this method
          [Sequelize.fn('max', Sequelize.col('createdAt')), 'createdAt'], //fn(function, col, alias)
          'id_unit' //set attributes, so we also need to call every col we need
        ],
        group: 'id_unit', //Important. means we combined the rows by id_unit, each id_unit would only has one row
        limit: 12, //client side need no more than 12
        order: [ //make sure the order of arr are from latest
          Sequelize.literal('`createdAt` DESC') //and here, using 'literal' is due to some wierd behavior of sequelize,
          //it would make an Error if we provide col name by 'arr'
        ]
      })
      .then((latestBroads)=>{
        let sendingData={
          unitsList: [],
          temp: {}
        };
        latestBroads.forEach((row, index)=>{
          sendingData.unitsList.unshift(row.id_unit);
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
          where: {
            createdAt: {[Op.lt]: sendingData.temp.last_visit}
          },
          //the list, could have duplicate unit because the same unit would be broad many times
          //so we trying to select & filter the row with same id_unit here
          attributes: [
            //'max' here combined with 'group' prop beneath,
            //because the GROUP by won't deal with the createdAt at the same time with id_unit,
            //so we ask only the 'max' one by this method
            [Sequelize.fn('max', Sequelize.col('createdAt')), 'createdAt'], //fn(function, col, alias)
            'id_unit' //set attributes, so we also need to call every col we need
          ],
          group: 'id_unit', //Important. means we combined the rows by id_unit, each id_unit would only has one row
          limit: 43, //concerning the efficiency of the later Fisher Yates
          order: [ //make sure the order of arr are from latest
            Sequelize.literal('`createdAt` DESC') //and here, using 'literal' is due to some wierd behavior of sequelize,
            //it would make an Error if we provide col name by 'arr'
          ]

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
          //an additional condition for the very begining, the resultBroads.length was 0 (db.broads was empty)
          for(let i=0; i< remainLength && i< resultBroads.length; i++){
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
