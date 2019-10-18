const express = require('express');
const execute = express.Router();

const winston = require('../../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_usersCustomIndex = require('../../../db/models/index').users_custom_index;
const _DB_usersUnits = require('../../../db/models/index').users_units;
const _DB_units = require('../../../db/models/index').units;
const {_res_success} = require('../../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
} = require('../../utils/reserrHandler.js');

function _handle_GET_feed_customSelected(req, res){
  new Promise((resolve, reject)=>{
    let userId = req.extra.tokenUserId;

    let reqLimit = req.query.require; //get params passed

    let pSelectUsersCustom = _DB_usersCustomIndex.findOne({
          where: {
            id_user: userId
          },
          attributes: ['last_visit', 'currentbelong', 'id_user']
        }).catch((err)=>{throw err}),
        pSelectUsersUnits = _DB_usersUnits.findAndCountAll({
          where: {
            id_user: userId
          }
        }).catch((err)=>{throw err});

    Promise.all([
      pSelectUsersCustom,
      pSelectUsersUnits
    ]).then(([resultUserCustom, resultUsersUnits])=>{

      let readList = resultUsersUnits.rows.map((row,index)=>{
        return row.id_unit;
      });

      return _DB_units.findAndCountAll({
        where: {
          createdAt: {[Op.lt]: resultUserCustom.last_visit},
          id: {[Op.notIn]: readList},
          limit: 50, //assume the reqLimit is always smaller than 50
          order: [['createdAt', 'DESC']] //make sure the order of arr are from latest
        }
      }).then((resultUnits)=>{
        //at this part, we are going to prevent an extreme situation: not enough candidate, the user has already read most of the Unit before
        if(results.count < reqLimit){ //which means, we can't get enough candidate
          //we could only choose again, but without limit 'read' this time
          return _DB_units.findAndCountAll({
            where: {
              createdAt: {[Op.lt]: resultUserCustom.last_visit},
              limit: 200,
              order: [['createdAt', 'DESC']] //make sure the order of arr are from latest
            }
          })
        }
        else return resultUnits; //just return the result if the candidate is enough
      })

    }).then((resultUnits)=>{
      let sendingData={
        unitsList: [],
        temp: {}
      }

      //at this part, we pick Units by created time: not earlier than 5 months for current standard
      let dateLimit = new Date();
      dateLimit.setMonth(d.getMonth() - 5);

      let qualified = resultUnits.rows.filter((row, index)=>{
        return row.createdAt > dateLimit; //pick later than standard first
      });

      if(qualified.length < reqLimit) qualified = resultUnits.rows; //but if there is not enough Units, give up date standard

      //now, the qualified array should enough and checked
      //we just select the require number randomly
      //it's important keep it randomly, or the return would easily be the same
      const amountGap = qualified.length - reqLimit; //to know how many spare need to be removed
      //so we are going to loop for removeing items from qualified as many as the gap between reqLimit
      //in this way, we don't need to worry about the problem came from 'shallow copy',
      //because the gap is fixed, and we need the qualified 'really' modified this time.
      for(let i = 0; i < amountGap ; i++){
        let pickIndex = Math.floor(Math.random() * qualified.length); //random between 0 - (length-1), the length of qualified would reduce along the process
        qualified.splice(pickIndex, 1);
        //and splice the picked one rom qualified, qualified would shorter now, and closer to the length we need
      }

      sendingData.unitsList = qualified;

      resolve(sendingData);
    }).catch((err)=>{
      reject(new internalError(err, 131));
    });
  }).then((sendingData)=>{
    _res_success(res, sendingData, "feed, GET: /custom/selected, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

module.exports = _handle_GET_feed_customSelected;
