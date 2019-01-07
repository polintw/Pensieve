const express = require('express');
const execute = express.Router();
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../config/jwt.js');
const {_res_success} = require('../utils/resHandler.js');
const {
  _select_Basic
} = require('../utils/dbSelectHandler.js');
const {
  _handler_err_NotFound,
  _handler_err_BadReq,
  _handler_err_Unauthorized,
  _handler_err_Internal
} = require('../utils/reserrHandler.js');

function _handle_users_basic_GET(req, res){
  jwt.verify(req.headers['token'], verify_key, function(err, payload) {
    if (err) {
      _handler_err_Unauthorized(err, res)
    } else {
      const userId = payload.user_Id;
      let fetchList = req.query.fetchList;

      let accordancesList = fetchList.map((id, index)=>{return [id];});
      let mysqlForm = {
        accordancesList: accordancesList
      },
      condition = {
        table: "users",
        cols: ["id", "account"],
        where: ["id"]
      };

      _select_Basic(condition, mysqlForm.accordancesList).then((result)=>{
        if(result.length < 1){throw {status: 500, err: 'id array of users fail when searching'}};
        let sendingData={
          usersBasic:{},
          temp: {}
        };

        result.forEach((row, index)=>{
          sendingData.usersBasic[row.id] = {
            id: row.id,
            account: row.account
          };
        })

        return sendingData;
      }).then((sendingData)=>{
        _res_success(res, sendingData, "Complete, GET: users/basic.");
      }).catch((errObj)=>{
        console.log("error occured during GET: users/basic promise: "+(errObj.err?errObj.err:errObj))
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

execute.get('/basic', function(req, res){
  console.log('GET: users/basic');
  _handle_users_basic_GET(req, res);
})

module.exports = execute;
