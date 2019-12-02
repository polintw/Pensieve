const express = require('express');
const execute = express.Router();
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../config/jwt.js');
const winston = require('../../config/winston.js');
const _DB_broads = require('../../db/models/index').broads;
const _DB_units = require('../../db/models/index').units;
const _DB_unitsAuthor = require('../../db/models/index').units_author;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
  forbbidenError
} = require('../utils/reserrHandler.js');

function _handle_GET_shareStatics_reach(req, res){
  new Promise((resolve, reject)=>{
    const userId = req.extra.tokenUserId;

    const reqUnitId = req.reqUnitId; //unit we now focus on

    //first, check the user is ideed the author
    return _DB_units.findOne({
      where: {id: reqUnitId},
      attributes: ['id_author']
    }).then((result)=>{
      if(result.id_author !== userId){throw new forbbidenError("You are forbbiden to get this records.",87);}
      else {
        // then, we get the reach count now
        return _DB_unitsAuthor.findOne({
          where: {id_unit: reqUnitId},
          attributes: ['reach', 'broaded']
        }).then((statics)=>{
          let sendingData = {
            temp: {},
            countReach: statics.reach,
            countBroad: statics.broaded
          };

          resolve(sendingData);
        }).catch((err)=>{
          throw err;
        });
      }
    }).catch((err)=>{
      reject(new internalError(err, 131));
    });
  }).then((sendingData)=>{
    _res_success(res, sendingData, "GET: /share/:id/statics, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /share/:id/statics ');
  let src = req.query.sr;
  //in the future, we should use 'src' to determine the method used,
  //but there is only one possibility for now, so we just run it directly
  _handle_GET_shareStatics_reach(req, res);
})

module.exports = execute;
