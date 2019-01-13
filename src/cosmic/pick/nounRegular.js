const fs = require('fs');
const path = require("path");
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../../config/jwt.js');
const {connection_key} = require('../../../config/database.js');
const {_res_success} = require('../../utils/resHandler.js');
const {
  _promise_composeUnitsBasic_old,
  _promise_composeUsersBasic_old,
  _promise_composeMarksBasic_old
} = require('../../utils/dbComposeHandler.js');
const {_handler_err_BadReq, _handler_err_Unauthorized, _handler_err_Internal} = require('../../utils/reserrHandler.js');

const database = mysql.createPool(connection_key);

function _handle_cosmic_pickNounRegular(req, res){
  jwt.verify(req.headers['token'], verify_key, function(err, payload) {
    if (err) {
      _handler_err_Unauthorized(err, res)
    } else {
      let userId = payload.user_Id;
      if(!req.query.id){_handler_err_BadReq('invalid query.', res);return}//prevent the server crushing due to invalid query .
      database.getConnection(function(err, connection){
        if (err) {
          _handler_err_Internal(err, res);
          console.log("error occured when getConnection in loading nounRegular in Cosmic noun.")
        }else{
          console.log('loading req: nounRegular in Cosmic noun.');
          new Promise((resolve, reject)=>{
            console.log('loading req: nounRegular in Cosmic noun, select related list.');
            let selectQuery = "SELECT id_unit, id_author FROM attribution WHERE id_noun = ?";
            connection.query(selectQuery, [req.query.id], function(err, rows, fields){
              if (err) {_handler_err_Internal(err, res);reject(err);return} //only with "return" could assure the promise end immediately if there is any error.
              console.log('database connection: success.');
              let sendingData ={
                unitsList: [],
                unitsBasic: {},
                marksBasic: {},
                usersBasic: {},
                temp: {unitsList: [], usersList: [], marksList: []}
              };
              if(rows.length> 0){
                rows.forEach((row, index)=>{
                  sendingData.unitsList.push(row.id_unit);
                  sendingData.unitsBasic[row.id_unit] = {marksList: []};
                  sendingData.temp.unitsList.push([row.id_unit]);
                  sendingData.temp.usersList.push([row.id_author]);
                  sendingData.temp.marksList.push([row.id_unit]);
                })
                resolve(sendingData);
              }else{
                _res_success(res, sendingData, "loading req: nounRegular in Cosmic noun, complete");
                connection.release();
                return;
              }
            })
          }).then((sendingData)=>{
            let _dbSelection_UsersBasic = _promise_composeUsersBasic_old(connection, {usersBasic:{}, temp: {usersList: sendingData.temp.usersList}});
            let _dbSelection_UnitsBasic = _promise_composeUnitsBasic_old(connection, {unitsBasic: {}, temp: {unitsList: sendingData.temp.unitsList}}, "id");
            let _dbSelection_MarksBasic = _promise_composeMarksBasic_old(connection, {marksBasic: {}, unitsBasic: {}, temp: {marksList: sendingData.temp.marksList}}, "id_unit");
            return Promise.all([_dbSelection_UnitsBasic, _dbSelection_MarksBasic, _dbSelection_UsersBasic]).then((results)=>{
              return new Promise((resolve, reject)=>{
                let composedUnitsBasic = results[0];
                let composedMarksBasic = results[1];
                let composedUsersBasic = results[2];
                Object.assign(sendingData.unitsBasic, composedMarksBasic.unitsBasic, composedUnitsBasic.unitsBasic);//unitBasic from composedUnitsBasic contain a more complete marksList.
                Object.assign(sendingData.marksBasic, composedMarksBasic.marksBasic);
                Object.assign(sendingData.usersBasic, composedUsersBasic.usersBasic);
                resolve(sendingData);
              })
            });
          }).then((sendingData)=>{
            _res_success(res, sendingData, "loading req: nounRegular in Cosmic noun, complete");
            connection.release();
          }).catch((err)=>{
            console.log("error occured during nounRegular in Cosmic noun req promise: "+err)
            connection.release();
          });
        }
      })
    }
  })
};

module.exports = _handle_cosmic_pickNounRegular
