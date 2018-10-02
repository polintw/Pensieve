const fs = require('fs');
const path = require("path");
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../../config/jwt.js');
const {connection_key} = require('../../../config/database.js');
const {_handler_err_BadReq, _handler_err_Unauthorized, _handler_err_Internal} = require('../../utils/reserrHandler.js');

const database = mysql.createPool(connection_key);

function _res_success(res, sendingData){
  console.log("loading req: Inspired, complete.")
  delete sendingData.temp;
  let resData = {};
  resData['error'] = 0;
  resData['message'] = 'req success!';
  resData['main'] = sendingData;
  resData = JSON.stringify(resData); //could assure we send the data in json format
  res.status(200).json(resData);
}

function _handle_cognition_loading_Inspired(req, res){
  jwt.verify(req.headers['token'], verify_key, function(err, payload) {
    if (err) {
      _handler_err_Unauthorized(err, res)
    } else {
      let userId = payload.user_Id;
      database.getConnection(function(err, connection){
        if (err) {
          _handler_err_Internal(err, res);
          console.log("error occured when getConnection for loading user Inspired list.")
        }else{
          new Promise((resolve, reject)=>{
            console.log('loading req: Inspired, approach list.');
            connection.query('SELECT * FROM inspired WHERE id_user = ?', [userId], function(err, rows, fields) {
              if (err) {_handler_err_Internal(err, res);reject(err);}
              console.log('database connection: success.')
              let sendingData = {
                inspiredList:[],
                inspiredMarksSet: {},
                unitBasicSet: {},
                userBasic: {},
                temp: {unitsList:[], authorsList:[]}
              }
              if (rows.length > 0) {
                rows.forEach(function(row, index){
                  sendingData.inspiredList.push([row.id_mark]);
                })
                resolve(sendingData)
              } else {
                _res_success(res, sendingData);
                connection.release();
              }
            })
          }).then(function(sendingData){
            console.log('loading req: Inspired, get marks.');
            return new Promise((resolve, reject)=>{
              connection.query('SELECT * FROM marks WHERE id IN (?)', [sendingData.inspiredList], function(err, rows, fields) {
                if (err) {_handler_err_Internal(err, res);reject(err);return}
                console.log('database connection: success.')
                if (rows.length > 0) {
                  rows.forEach(function(row, index){
                    let dataSet = {
                      markEditorContent: JSON.parse(row.editor_content), //because the data would transfer to string by db when saved
                      layer: row.layer,
                      unitId:row.id_unit,
                      authorId: row.id_author
                    }
                    sendingData.inspiredMarksSet[row.id] = dataSet;
                    sendingData.temp.unitsList.push([row.id_unit]);
                    sendingData.temp.authorsList.push([row.id_author]);
                  })
                  resolve(sendingData)
                } else {
                  _handler_err_Internal(err, res);reject(err);
                }
              })
            })
          }).then((sendingData)=>{
            let _db_selectFromUnits = new Promise((resolve, reject)=>{
              console.log('loading req: Inspired, get unit data.');
              let selectQuery = "SELECT id, id_author, url_pic_layer0, url_pic_layer1 FROM units WHERE id IN (?)";
              connection.query(selectQuery, [sendingData.temp.unitsList], function(err, rows, fields){
                if (err) {_handler_err_Internal(err, res);reject(err);return} //only with "return" could assure the promise end immediately if there is any error.
                resolve(rows);
              })
            });
            let _db_selectFromUsers = new Promise((resolve, reject)=>{
              console.log('loading req: Inspired, get author basic.');
              let selectQuery = "SELECT id, account FROM users WHERE id IN (?)";
              connection.query(selectQuery, [sendingData.temp.authorsList], function(err, rows, fields){
                if (err) {_handler_err_Internal(err, res);reject(err);return} //only with "return" could assure the promise end immediately if there is any error.
                resolve(rows);
              })
            });
            return Promise.all([_db_selectFromUnits, _db_selectFromUsers]).then(
              (results)=>{
                return new Promise((resolve, reject)=>{
                  let unitsRows = results[0];
                  let usersRows = results[1];
                  unitsRows.forEach((row, index)=>{
                    sendingData.unitBasicSet[row.id]={
                      unitId: row.id,
                      authorId: row.id_author,
                      pic_layer0: row.url_pic_layer0,
                      pic_layer1: row.url_pic_layer1
                    }
                  })
                  usersRows.forEach((row, index)=>{
                    sendingData.userBasic[row.id] = {
                      authorAccount: row.account
                    }
                  })
                  resolve(sendingData);
                })
              }
            )
          }).then(function(sendingData){
            _res_success(res, sendingData);
            connection.release();
          }).catch((err)=>{
            console.log("error occured during Inspired list req promise: "+err)
            connection.release();
          });
        }
      })
    }
  })
}

module.exports = _handle_cognition_loading_Inspired
