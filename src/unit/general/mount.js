const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../../config/jwt.js');
const {connection_key} = require('../../../config/database.js');
const {_res_success} = require('../../utils/resHandler.js');
const {_handler_err_BadReq, _handler_err_Unauthorized, _handler_err_Internal} = require('../../utils/reserrHandler.js');

const database = mysql.createPool(connection_key);

function _handle_unit_Mount(req, res){
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
          let _promise_unitToNouns = function(tempData){
            return new Promise((resolve, reject)=>{
              let selectQuery = 'SELECT id_noun FROM attribution WHERE id_unit=?';
              connection.query(selectQuery, [reqUnit], function(err, results, fields) {
                if (err) {_handler_err_Internal(err, res);reject(err);}
                console.log('database connection: success.')
                if (results.length > 0) {
                  results.forEach(function(result, index){
                    tempData['nouns'].list.push(result.id_noun);
                    tempData['temp'].nounsKey.push([result.id_noun]);
                  })
                  resolve(tempData)
                } else {
                  resolve(tempData)
                }
              })
            }).then((tempData)=>{
              return new Promise((resolve, reject)=>{
                let selectQuery = 'SELECT id, name FROM nouns WHERE (id) IN (?)';
                connection.query(selectQuery, [tempData['temp'].nounsKey], function(err, results, fields) {
                  if (err) {_handler_err_Internal(err, res);reject(err);}
                  console.log('database connection: success.')
                  if (results.length > 0) {
                    results.forEach(function(result, index){
                      tempData['nouns']['basic'][result.id] = {id:result.id, name: result.name};
                    })
                    //this part is a temp method before a whole update of this file.
                    tempData.sendingData.nouns = tempData.nouns;
                    let sendingData = Object.assign({}, tempData.sendingData);
                    resolve(sendingData)
                  } else {
                    resolve(sendingData)
                  }
                })
              })
            })
          }

          new Promise((resolve, reject)=>{
            console.log('unit mount req: check author.');
            connection.query('SELECT id_author FROM units WHERE id = ?', [reqUnit], function(err, result, fields) {
              if (err) {_handler_err_Internal(err, res);reject(err);}
              console.log('database connection: success.')
              let sendingData = {
                temp: {marksKey: []},
                marksObj: {},
                refsArr: [],
                nouns: {
                  list: [],
                  basic: {},
                },
                authorBasic: {},
                identity: ""
              }
              if (result.length > 0) {
                sendingData['authorBasic']['authorId'] = result[0].id_author;
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
              connection.query('SELECT account FROM users WHERE id = ?', [sendingData['authorBasic']['authorId']], function(err, result, fields) {
                if (err) {_handler_err_Internal(err, res);reject(err);}
                console.log('database connection: success.')
                if (result.length > 0) {
                  sendingData['authorBasic']['account'] = result[0].account;
                  resolve(sendingData)
                } else {
                  resolve(sendingData)
                }
              })
            })
          }).then((sendingData)=>{
            //this part has been rewritten to a newer style, prepareing for future modified
            let tempData = {
              nouns: {
                list: [],
                basic: {}
              },
              temp: {nounsKey: []},
              sendingData: sendingData
            }
            return _promise_unitToNouns(tempData)
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
            _res_success(res, sendingData);
            connection.release();
          }).catch((err)=>{
            console.log("error occured during unit mounting promise: "+err)
            connection.release();
          });
        }
      })
    }
  })
};

module.exports = _handle_unit_Mount
