const fs = require('fs');
const path = require("path");
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../../config/jwt.js');
const {connection_key} = require('../../../config/database.js');
const {_handler_err_BadReq, _handler_err_Unauthorized, _handler_err_Internal} = require('../../utils/reserrHandler.js');

const database = mysql.createPool(connection_key);

function _res_success(res, sendingData){
  console.log("loading req: lookout list, complete.")
  delete sendingData.temp;
  let resData = {};
  resData['error'] = 0;
  resData['message'] = 'req success!';
  resData['main'] = sendingData;
  resData = JSON.stringify(resData);
  res.status(200).json(resData);
}

function _promise_unitLtd(req, res){
  jwt.verify(req.headers['token'], verify_key, function(err, payload) {
    if (err) {
      _handler_err_Unauthorized(err, res)
    } else {
      let userId = payload.user_Id;
      database.getConnection(function(err, connection){
        if (err) {
          _handler_err_Internal(err, res);
          console.log("error occured when getConnection in loading lookoutlist.")
        }else{
          new Promise((resolve, reject)=>{
            console.log('loading req: Lookout.');
            connection.query('SELECT * FROM units WHERE id_author <> ?', [userId], function(err, rows, fields) {
              if (err) {_handler_err_Internal(err, res);reject(err);}
              console.log('database connection: success.')
              let sendingData = {
                unitsList:[],
                unitsBasicSet: {},
                markBasic: {},
                userBasic: {},
                temp: {unitsList: [], authorsList:[]}
              }
              if (rows.length > 0) {
                rows.forEach(function(row, index){
                  let unitId = row.id.toString();
                  sendingData.unitsList.push(unitId);
                  sendingData.unitsBasicSet[unitId] = {
                    unitId: unitId,
                    authorId: row.id_author,
                    pic_layer0: row.url_pic_layer0,
                    pic_layer1: row.url_pic_layer1,
                    marks: []
                  }
                  sendingData.temp.unitsList.push([row.id]);
                  sendingData.temp.authorsList.push([row.id_author]);
                })
                resolve(sendingData)
              } else {
                _res_success(res, sendingData);
                connection.release();
              }
            })
          }).then((sendingData)=>{
            let _db_selectFromMarks = new Promise((resolve, reject)=>{
              console.log('loading req: Lookout, get related mark.');
              let selectQuery = "SELECT id, id_unit, layer, editor_content FROM marks WHERE (id_unit) IN (?)";
              connection.query(selectQuery, [sendingData.temp.unitsList], function(err, rows, fields){
                if (err) {_handler_err_Internal(err, res);reject(err);return} //only with "return" could assure the promise end immediately if there is any error.
                resolve(rows);
              })
            });
            let _db_selectFromUsers = new Promise((resolve, reject)=>{
              console.log('loading req: Lookout, get author basic.');
              let selectQuery = "SELECT id, account FROM users WHERE (id) IN (?)";
              connection.query(selectQuery, [sendingData.temp.authorsList], function(err, rows, fields){
                if (err) {_handler_err_Internal(err, res);reject(err);return} //only with "return" could assure the promise end immediately if there is any error.
                resolve(rows);
              })
            });
            return Promise.all([_db_selectFromMarks, _db_selectFromUsers]).then(
              (results)=>{
                return new Promise((resolve, reject)=>{
                  let marksRows = results[0];
                  let usersRows = results[1];
                  marksRows.forEach((row, index)=>{
                    sendingData.markBasic[row.id] = {
                      markId: row.id,
                      layer: row.layer,
                      editorContent: JSON.parse(row.editor_content),
                      unitId: row.id_unit
                    }
                    sendingData.unitsBasicSet[row.id_unit].marks.push(row.id);
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
          }).then((sendingData)=>{
            _res_success(res, sendingData);
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

module.exports = _promise_unitLtd
