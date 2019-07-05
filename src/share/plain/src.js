'use strict';

const fs = require('fs');
const path = require('path');
const winston = require('../../../config/winston.js');
const {envJSONUnitReachPath} = require('../../../config/.env.json');
const _DB_unitsAuthor = require('../../../db/models/index').units_author;
const {
  internalError,
} = require('../../utils/reserrHandler.js');

function _reachCreate(unitId, userId){
  //actually, it is better write in a Promise
  //I just did it for convenience

  let rawData = fs.readFileSync(path.join(envJSONUnitReachPath, "units_reach.json"));
  let objReachStatus = JSON.parse(rawData);

  objReachStatus[unitId] = [];

  let modifiedData = JSON.stringify(objReachStatus, null, 2);
  fs.writeFile(path.join(envJSONUnitReachPath, "units_reach.json"), modifiedData, (err) => {
    if(err) throw new internalError("throw by /share plain POST, reachCreate, "+err, 131);
  });

  _DB_unitsAuthor.create({
    id_unit: unitId,
    id_author: userId
  }).catch((err)=>{
    throw new internalError("throw by /share plain POST, reachCreate, "+err, 131);
  });
  /*
  actually, there is a serious issue may happen
  if the units_reach.json file was edit by others in the same time.
  would be dissapeare automatically after the file was divided depending on Unit
  */
}

module.exports = {
  _reachCreate
}
