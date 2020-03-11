'use strict';

const path = require('path');
const Sequelize = require('sequelize');
const winston = require('../../../config/winston.js');
const _DB_usersUnits = require('../../../db/models/index').users_units;

function _submitUsersUnits(unitId, userId){
  return _DB_usersUnits.findOne({
    where:{
      id_unit: unitId,
      id_user: userId
    }
  }).then(result => {
    //result could be a records or null, depend on user's interaction with the unit
    if(Boolean(result)){ //read already, update the count and timeDistance
      let prevTimeDistance = JSON.parse(result.timeDistance), //parse back to array
          nowTime = new Date();

      let currentDistance = nowTime - result.lastTime; //distance to last view, in order to reduce 'digit' of the time num
      //save as seconds (miliseconds orginally)
      prevTimeDistance.unshift(Math.ceil(currentDistance/1000));

      return _DB_usersUnits.update(
        {
          count: result.count+1,
          lastTime: Sequelize.literal('CURRENT_TIMESTAMP'),
          timeDistance: JSON.stringify(prevTimeDistance)
        },
        {
          where: {
            id_user: userId,
            id_unit: unitId
          }
        }
      );
    }else{ //no records, no matter what's the reason
      //just create records directly
      return _DB_usersUnits.create(
        {
          id_user: userId,
          id_unit: unitId
        }
      )
    }
  }).catch((err)=>{
    throw ("throw by _submitUsersUnits, "+err);
  });
}

module.exports = _submitUsersUnits
