const express = require('express');
const execute = express.Router();
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../config/jwt.js');
const {_res_success} = require('../utils/resHandler.js');
const {
  _insert_withPromise_Basic
} = require('../utils/dbInsertHandler.js');
const {
  _select_withPromise_Basic,
  _select_withPromise_BasicNoLength
} = require('../utils/dbSelectHandler.js');
const {
  TRACKS_USERS
} = require('../utils/queryIndicators.js');
const {
  _handler_err_NotFound,
  _handler_err_BadReq,
  _handler_err_Unauthorized,
  _handler_err_Internal
} = require('../utils/reserrHandler.js');

function _handle_units_track_POST(req, res){
  jwt.verify(req.headers['token'], verify_key, function(err, payload) {
    if (err) {
      _handler_err_Unauthorized(err, res)
    } else {
      console.log('post req: unit track.');
      let userId = payload.user_Id;
      let mysqlForm = {
        accordancesList: [[userId]]
      };

      //first, selecting by accordancelist
      _select_withPromise_BasicNoLength(TRACKS_USERS, mysqlForm.accordancesList).then((results)=>{
        let sendingData={temp: {}},
            unitId = req.reqUnitId;
        let permit = results.every((row)=>{
              return row.id_unit !== unitId
            });
        if(!permit) throw {status: 400, err: "Already tracked!"};
        return _insert_withPromise_Basic("tracks", {id_user: userId, id_unit: unitId}).then(()=>{
          return sendingData
        })
      }).then((sendingData)=>{
        _res_success(res, sendingData, "post req: unit track, complete.");
      }).catch((errObj)=>{
        console.log("error occured during getting unit track promise: "+errObj.err)
        if("status" in errObj){ //temporary method, due to there are still some function didn't have "status" argument.
          switch (errObj.status) {
            case 400:
              _handler_err_BadReq(errObj.err, res)
            case 404:
              _handler_err_NotFound(errObj.err, res);
              break;
            case 500:
              _handler_err_Internal(errObj.err, res);
              break;
            default:
              _handler_err_Internal(errObj.err, res);
          }
          return;
        }
        _handler_err_Internal(errObj.err, res);
      });

    }
  })
}

execute.post('/', function(req, res){
  console.log('request: POST, units/tracks');
  _handle_units_track_POST(req, res);
})

module.exports = execute;
