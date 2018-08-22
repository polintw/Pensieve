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
exports._promise_unitMount = function(req, res){
  const reqUnit = req.query.unitName.split("_")[1];

  jwt.verify(req.headers['token'], verify_key, function(err, payload) {
    if (err) {
      _handler_err_Unauthorized(err, res)
    } else {
      let userId = payload.user_Id;
      database.getConnection(function(err, connection){
        if (err) {
          _handler_err_Internal(err, res);
          console.log("error occured when getConnection for mounting unit.")
        }else{
          new Promise((resolve, reject)=>{
            console.log('unit mount req: check author.');
            connection.query('SELECT id_author FROM units WHERE id = ?', [reqUnit], function(err, result, fields) {
              if (err) {_handler_err_Internal(err, res);reject(err);}
              console.log('database connection: success.')
              let sendingData = {
                temp: {marksKey: []},
                marksObj: {},
                refsArr: [],
                nounsArr: [],
                author: "",
                identity: ""
              }
              if (result.length > 0) {
                sendingData['author'] = result[0].id_author;
                if(userId == result[0].id_author){
                  sendingData['identity'] = "author"
                }else{
                  sendingData['identity'] = "viewer"
                }
                resolve(sendingData)
              } else {
                resolve(sendingData)
              }
            })
          }).then(function(sendingData){
            console.log('unit mount req: call author name.');
            return new Promise((resolve, reject)=>{
              connection.query('SELECT account FROM users WHERE id = ?', [sendingData['author']], function(err, result, fields) {
                if (err) {_handler_err_Internal(err, res);reject(err);}
                console.log('database connection: success.')
                if (result.length > 0) {
                  sendingData['author'] = result[0].account;
                  resolve(sendingData)
                } else {
                  resolve(sendingData)
                }
              })
            })
          }).then(function(sendingData){
            console.log('unit mount req: call nouns.');
            return new Promise((resolve, reject)=>{
              connection.query('SELECT name_noun FROM nouns WHERE id_unit=?', [reqUnit], function(err, result, fields) {
                if (err) {_handler_err_Internal(err, res);reject(err);}
                console.log('database connection: success.')
                if (result.length > 0) {
                  result.forEach(function(obj, index){
                    sendingData['nounsArr'].push(obj.name_noun);
                  })
                  resolve(sendingData)
                } else {
                  resolve(sendingData)
                }
              })
            })
          }).then(function(sendingData){
            console.log('unit mount req: assemble marksObj.');
            return new Promise((resolve, reject)=>{
              connection.query('SELECT * FROM marks WHERE id_unit=?', [reqUnit], function(err, result, fields) {
                if (err) {_handler_err_Internal(err, res);reject(err);}
                console.log('database connection: success.')
                if (result.length > 0) {
                  result.forEach(function(row, index){
                    let obj = {
                      markCoordinate: {top: row.portion_top, left: row.portion_left},
                      markEditorContent: JSON.parse(row.editor_content), //because the data would transfer to string by db when saved
                      serial: row.serial,
                      layer: row.layer,
                      inspired: false
                    };
                    let markKey = row.id;
                    sendingData['marksObj'][markKey]=obj;
                    sendingData['temp']['marksKey'].push([row.id]);
                  })
                  resolve(sendingData)
                } else {
                  resolve(sendingData)
                }
              })
            })
          }).then(function(sendingData){
            console.log('unit mount req: marksObj append.');
            return new Promise((resolve, reject)=>{
              let sqlQuery = "SELECT * FROM inspired WHERE (id_mark) IN (?) AND id_user = "+userId;
              connection.query(sqlQuery, [sendingData['temp']['marksKey']], function(err, result, fields) {
                if (err) {_handler_err_Internal(err, res);reject(err);}
                console.log('database connection: success.')
                if (result.length > 0) {
                  result.forEach(function(row, index){
                    sendingData['marksObj'][row.id_mark]['inspired'] = true;
                  })
                  resolve(sendingData)
                } else {
                  resolve(sendingData)
                }
              })
            })
          }).then((sendingData)=>{
            delete sendingData.temp;
            let resData = {};
            resData['error'] = 0;
            resData['message'] = 'req success!';
            resData['main'] = sendingData;
            resData = JSON.stringify(resData);
            res.status(200).json(resData);
            connection.release();
          }).catch((err)=>{
            console.log("error occured during lookoutlist req promise: "+err)
            connection.release();
          });
        }
      })
    }
  })
};
