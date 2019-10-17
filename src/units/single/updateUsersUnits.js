'use strict';

const path = require('path');
const Sequelize = require('sequelize');
const winston = require('../../../config/winston.js');
const _DB_usersUnits = require('../../../db/models/index').users_units;

function _submitUsersUnits(unitId, userId){
  _DB_usersUnits.findOne({
    where:{
      id_unit: unitId,
      id_user: userId
    }
  }).then(result => {

    Boolean(result)

    let prevTimeDistance = JSON.parse(result.timeDistance),
        nowTime = new Date();

    let currentDistance = nowTime - result.createdAt;
    let updateTimeDistance = prevTimeDistance.unshift(currentDistance);

    _DB_usersUnits.update(
      {
        count: result.count+1,
        lastTime: Sequelize.literal('CURRENT_TIMESTAMP'),
        timeDistance: JSON.stringify(updateTimeDistance)
      },
      {
        where: {
          id_user: userId,
          id_unit: unitId
        }
      }
    )

    _DB_usersUnits.create(
      {
        id_user: userId,
        id_unit: unitId
      }
    )

  }).catch((err)=>{
    throw ("throw by _submitUsersUnits, "+err);
  });

}

module.exports = _submitUsersUnits
