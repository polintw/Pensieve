'use strict';

const fs = require('fs');
const path = require('path');
const winston = require('../../../config/winston.js');
const {envJSONUnitTouchPath} = require('../../../config/.env.json');
const _DB_unitsAuthor = require('../../../db/models/index').units_author;

function _touchedStatus(unitId, userId){
  let rawData = fs.readFileSync(path.join(envJSONUnitTouchPath, "units_touch.json"));
  let objTouchedStatus = JSON.parse(rawData);

  let currentList = objTouchedStatus[unitId];
  if(currentList.includes(userId)) return
  else{
    currentList.push(userId);
    //current length as count, and updating into db for author checking
    let length = currentList.length;
    _DB_unitsAuthor.update(
      {touched: length},
      {where: {id_unit: unitId}}
    ).catch((err)=>{
      throw err;
    });
    //then write the new data back to json file
    let modifiedData = JSON.stringify(objTouchedStatus, null, 2);
    fs.writeFile(path.join(envJSONUnitTouchPath, "units_touch.json"), modifiedData, (err) => {
      if (err) throw err;
    });
  }
}

module.exports = _touchedStatus
