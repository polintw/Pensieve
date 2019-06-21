'use strict';

const fs = require('fs');
const path = require('path');
const winston = require('../../../config/winston.js');
const {envJSONUnitTouchPath} = require('../../../config/.env.json');
const _DB_unitsAuthor = require('../../../db/models/index').units_author;
const {
  internalError,
} = require('../../utils/reserrHandler.js');

function _touchedCreate(unitId, userId){
  //actually, it is better write in a Promise
  //I just did it for convenience

  let rawData = fs.readFileSync(path.join(envJSONUnitTouchPath, "units_touch.json"));
  let objTouchedStatus = JSON.parse(rawData);

  objTouchedStatus[unitId] = [];

  let modifiedData = JSON.stringify(objTouchedStatus, null, 2);
  fs.writeFile(path.join(envJSONUnitTouchPath, "units_touch.json"), modifiedData, (err) => {
    throw new internalError("throw by /share plain POST, touchedCreate, "+err, 131);
  });

  _DB_unitsAuthor.create({
    id_unit: unitId,
    id_author: userId
  }).catch((err)=>{
    throw new internalError("throw by /share plain POST, touchedCreate, "+err, 131);
  });
}

module.exports = {
  _touchedCreate
}
