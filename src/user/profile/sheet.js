const express = require('express');
const execute = express.Router();
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../../config/jwt.js');
const {_res_success} = require('../../utils/resHandler.js');
const {
  _insert_withPromise_Basic
} = require('../../utils/dbInsertHandler.js');
const {
  _select_Basic
} = require('../../utils/dbSelectHandler.js');
const {
  BROADS_USERS_UNITS
} = require('../../utils/queryIndicators.js');
const {
  _handler_err_NotFound,
  _handler_err_BadReq,
  _handler_err_Unauthorized,
  _handler_err_Internal
} = require('../../utils/reserrHandler.js');

function _handle_user_profileSheet_GET(req, res){
  jwt.verify(req.headers['token'], verify_key, function(err, payload) {
    if (err) {
      _handler_err_Unauthorized(err, res)
    } else {
      let userId = payload.user_Id;
      let mysqlForm = {
        accordancesList: [[userId]]
      },
      selectCondition = {
        table: "sheets",
        cols: ["gender"],
        where: ["id_user"]
      };
      //first, selecting by accordancelist
      _select_Basic(selectCondition, mysqlForm.accordancesList).then((resultSheet)=>{
        if(resultSheet.length < 1){throw {status: 500, err: 'no this user in DB'}};
        let sheetRec = resultSheet[0];
        let sendingData={
            sheetSet:{
              gender: sheetRec.gender,
            },
          temp: {}
        };
        return sendingData;
      }).then((sendingData)=>{
        _res_success(res, sendingData, "Complete, GET: user profile/sheet.");
      }).catch((errObj)=>{
        console.log("error occured during GET: user profile/sheet promise: "+errObj.err)
        switch (errObj.status) {
          case 400:
            _handler_err_BadReq(errObj.err, res);
            break;
          case 404:
            _handler_err_NotFound(errObj.err, res);
            break;
          case 500:
            _handler_err_Internal(errObj.err, res);
            break;
          default:
            _handler_err_Internal(errObj.err?errObj.err:errObj, res);
        }
      });
    }
  })
}

execute.get('/', function(req, res){
  console.log('GET: user profile/sheet');
  _handle_user_profileSheet_GET(req, res);
})

module.exports = execute;
