const fs = require('fs');
const path = require("path");
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../../config/jwt.js');
const {connection_key} = require('../../../config/database.js');

const database = mysql.createPool(connection_key);


function _handler_err_BadReq(err, res){
  let resData = {};
  resData['error'] = 1;
  resData['message'] = 'Error Occured: bad database query';
  res.status(400).json(resData);
 }

function _handler_err_Unauthorized(err, res){
  let resData = {};
  resData['error'] = 1;
  resData['message'] = "Token is invalid";
  res.status(401).json(resData);
}

function _handler_err_Internal(err, res){
  let resData = {};
  resData['error'] = 1;
  resData['message'] = 'Error Occured: Internal Server Error';
  res.status(500).json(resData);
}

function _promise_loadInspired(req, res){
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
          function _res_success(sendingData){
            console.log("loading req: Inspired, complete.")
            delete sendingData.temp;
            let resData = {};
            resData['error'] = 0;
            resData['message'] = 'req success!';
            resData['main'] = sendingData;
            res.status(200).json(resData);
          }

          new Promise((resolve, reject)=>{
            console.log('loading req: Inspired, approach list.');
            connection.query('SELECT * FROM inspired WHERE id_user = ?', [userId], function(err, rows, fields) {
              if (err) {_handler_err_Internal(err, res);reject(err);}
              console.log('database connection: success.')
              let sendingData = {
                inspiredList:[],
                inspiredMarksSet: {},
                unitBasicSet: {},
                temp: {unitsList:[]}
              }
              if (rows.length > 0) {
                rows.forEach(function(row, index){
                  sendingData.inspiredList.push([row.id_mark]);
                })
                resolve(sendingData)
              } else {
                _res_success(sendingData);
                connection.release();
              }
            })
          }).then(function(sendingData){
            console.log('loading req: Inspired, get marks.');
            return new Promise((resolve, reject)=>{
              console.log(sendingData.inspiredList)
              connection.query('SELECT * FROM marks WHERE id IN (?)', [sendingData.inspiredList], function(err, rows, fields) {
                if (err) {_handler_err_Internal(err, res);reject(err);}
                console.log('database connection: success.')
                console.log(rows)
                if (rows.length > 0) {
                  rows.forEach(function(row, index){
                    let dataSet = {
                      markEditorContent: row.editor_content,
                      layer: row.layer,
                      unitId:row.id_unit
                    }
                    sendingData.inspiredMarksSet[row.id] = dataSet;
                    sendingData.temp.unitsList.push([row.id_unit]);
                  })
                  resolve(sendingData)
                } else {
                  resolve(sendingData)
                }
              })
            })
          }).then(function(sendingData){
            console.log('loading req: Inspired, get unitsBasic.');
            return new Promise((resolve, reject)=>{
              connection.query('SELECT * FROM units WHERE id IN (?)', [sendingData.temp.unitsList], function(err, rows, fields) {
                if (err) {_handler_err_Internal(err, res);reject(err);}
                console.log('database connection: success.')
                if (rows.length > 0) {
                  rows.forEach(function(row, index){
                    let dataSet = {
                      authorId: row.id_author,
                      pic_layer0:row.url_pic_layer0,
                      pic_layer1:row.url_pic_layer1
                    }
                    sendingData.unitBasicSet[row.id] = dataSet;
                  })
                }
                _res_success(sendingData);
                connection.release();
              })
            })
          }).catch((err)=>{
            console.log("error occured during Inspired list req promise: "+err)
            connection.release();
          });
        }
      })
    }
  })
}

module.exports = _promise_loadInspired
