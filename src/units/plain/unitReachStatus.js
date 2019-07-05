'use strict';

const fs = require('fs');
const path = require('path');
const winston = require('../../../config/winston.js');
const {envJSONUnitReachPath} = require('../../../config/.env.json');
const _DB_unitsAuthor = require('../../../db/models/index').units_author;

function _reachStatus(unitId, userId){
  let rawData = fs.readFileSync(path.join(envJSONUnitReachPath, "units_reach.json"));
  let objReachStatus = JSON.parse(rawData);

  let currentList = objReachStatus[unitId];
  if(currentList.includes(userId)) return
  else{
    currentList.push(userId);
    //current length as count, and updating into db for author checking
    let length = currentList.length;
    _DB_unitsAuthor.update(
      {reach: length},
      {where: {id_unit: unitId}}
    ).catch((err)=>{
      throw ("throw by /units plain GET, reachStatus check, "+err);
    });
    //then write the new data back to json file
    let modifiedData = JSON.stringify(objReachStatus, null, 2);
    fs.writeFile(path.join(envJSONUnitReachPath, "units_reach.json"), modifiedData, (err) => {
      if(err) throw ("throw by /units plain GET, reachStatus check, "+err);
    });
  }
}

module.exports = _reachStatus
