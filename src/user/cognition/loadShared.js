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

function _promise_loadShared(req, res){
  jwt.verify(req.headers['token'], verify_key, function(err, payload) {
    if (err) {
      _handler_err_Unauthorized(err, res)
    } else {
      let userId = payload.user_Id;
      database.getConnection(function(err, connection){
        if (err) {
          _handler_err_Internal(err, res);
          console.log("error occured when getConnection for loading user shared.")
        }else{
          new Promise((resolve, reject)=>{
            console.log('loading req: Shared.');
            connection.query('SELECT * FROM units WHERE id_author = ?', [userId], function(err, rows, fields) {
              if (err) {_handler_err_Internal(err, res);reject(err);}
              console.log('database connection: success.')
              let sendingData = {
                unitsList:[],
                unitsBasicSet: {}
              }
              if (rows.length > 0) {
                rows.forEach(function(row, index){
                  let unitId = row.id.toString();
                  sendingData.unitsList.push(unitId);
                  sendingData.unitsBasicSet[unitId] = {unitId: row.id, pic_layer0: row.url_pic_layer0, pic_layer1: row.url_pic_layer1}
                })
                resolve(sendingData)
              } else {
                resolve(sendingData)
              }
            })
          }).then((sendingData)=>{
            let resData = {};
            resData['error'] = 0;
            resData['message'] = 'req success!';
            resData['main'] = sendingData;
            res.status(200).json(resData);
            connection.release();
          }).catch((err)=>{
            console.log("error occured during shared req promise: "+err)
            connection.release();
          });
        }
      })
    }
  })
}

module.exports = _promise_loadShared
