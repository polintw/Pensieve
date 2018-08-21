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

function _handle_actionInspired(req, res){
  jwt.verify(req.headers['token'], verify_key, function(err, payload) {
    if (err) {
      _handler_err_Unauthorized(err, res)
    } else {
      let userId = payload.user_Id;
      database.getConnection(function(err, connection){
        if (err) {
          _handler_err_Internal(err, res);
          console.log("error occured when getConnection in actionInspired handler.")
        }else{
          new Promise((resolve, reject)=>{
            console.log('action post: inspired aim to '+req.query.aim);
            const markId = parseInt(req.body.markKey);
            if(req.query.aim == "new"){
                connection.query('INSERT INTO inspired SET ?', {id_mark: markId, id_user: userId}, function(err, result, fields) {
                    if (err) {_handler_err_Internal(err, res);reject(err);}
                    console.log('database connection: success.')
                    resolve()
                })
            }else{
              connection.query('DELETE FROM inspired WHERE id_mark = ? AND id_user = ?', [markId, userId], function(err, result, fields) {
                if (err) {_handler_err_Internal(err, res);reject(err);}
                console.log('database connection: success.')
                resolve()
              })
            }
          }).then(()=>{
            let resData = {};
            resData['error'] = 0;
            resData['message'] = 'post req completed!';
            res.status(200).json(resData);
            connection.release();
          }).catch((err)=>{
            console.log("error occured in actionInspired promise: "+err)
            connection.release();
          });
        }
      })
    }
  })
}

module.exports = _handle_actionInspired
