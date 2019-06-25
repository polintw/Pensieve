const express = require('express');
const execute = express.Router();
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../config/jwt.js');
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
    const reqToken = req.body.token || req.headers['token'] || req.query.token;
    const jwtVerified = jwt.verify(reqToken, verify_key);
    if (!jwtVerified) throw new authorizedError("during GET--/share/:id/statics, "+jwtVerified, 32);

    const userId = jwtVerified.user_Id;
    const reqUnit = req.reqUnitId;

    //first, check the user is ideed the author
    return _DB_units.findOne({
      where: {id: reqUnit},
      attributes: ['id_author']
    }).then((result)=>{
      if(result.id_author !== userId){throw new forbbidenError("You are forbbiden to get this records.",87);}
      else {
        // then, we get the reach count now
        return _DB_unitsAuthor.findOne({
          where: {id_unit: reqUnit},
          attributes: ['reach']
        }).then((statics)=>{
          let sendingData = {
            temp: {},
            countReach: statics.reach
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
