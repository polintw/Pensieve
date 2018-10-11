const fs = require('fs');
const path = require("path");
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../../config/jwt.js');
const {connection_key} = require('../../../config/database.js');
const {_res_success} = require('../../utils/resHandler.js');
const {_handler_err_BadReq, _handler_err_Unauthorized, _handler_err_Internal} = require('../../utils/reserrHandler.js');

const database = mysql.createPool(connection_key);

function _handle_nouns_search(req, res){
  jwt.verify(req.headers['token'], verify_key, function(err, payload) {
    if (err) {
      _handler_err_Unauthorized(err, res)
    } else {
      let userId = payload.user_Id;
      let prefix = req.query.prefix;
      if(!prefix){_handler_err_BadReq('invalid query.', res);return}//prevent the server crushing due to invalid query .
      database.getConnection(function(err, connection){
        if (err) {
          _handler_err_Internal(err, res);
          console.log("error occured when getConnection in searching nouns list.")
        }else{
          new Promise((resolve, reject)=>{
            console.log('searching, nouns list.');
            let selectQuery = "SELECT id, name FROM nouns WHERE name = ?";
            connection.query(selectQuery, [prefix], function(err, rows, fields){
              if (err) {_handler_err_Internal(err, res);reject(err);return} //only with "return" could assure the promise end immediately if there is any error.
              console.log('database connection: success.');
              let sendingData ={
                nounsList: [],
                temp: {} //keep it as a default pair due to process in  _res_success()
              };
              if(rows.length> 0){
                rows.forEach((row, index)=>{
                  sendingData.nounsList.push({"name": row.name, "id": row.id})
                })
                resolve(sendingData);
              }else{
                _res_success(res, sendingData, "searching, nouns list, complete");
                connection.release();
                return;
              }
            })
          }).then((sendingData)=>{
            _res_success(res, sendingData, "searching, nouns list, complete");
            connection.release();
          }).catch((err)=>{
            console.log("error occured during searching promise, nouns list: "+err)
            connection.release();
          });
        }
      })
    }
  })
};

module.exports = _handle_nouns_search
