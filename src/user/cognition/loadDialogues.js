const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../../config/jwt.js');
const {connection_key} = require('../../../config/database.js');
const {_handler_err_BadReq, _handler_err_Unauthorized, _handler_err_Internal} = require('../../handlers/reserrHandler.js');

const database = mysql.createPool(connection_key);

function _res_success(res, sendingData){
  console.log("loading req: Dialogues, complete.")
  delete sendingData.temp;
  let resData = {};
  resData['error'] = 0;
  resData['message'] = 'req success!';
  resData['main'] = sendingData;
  resData = JSON.stringify(resData);
  res.status(200).json(resData);
}

function _handle_cognition_loading_dialogues(req, res){
    jwt.verify(req.headers['token'], verify_key, function(err, payload) {
      if (err) {
        _handler_err_Unauthorized(err, res)
      } else {
        let userId = payload.user_Id;
        database.getConnection(function(err, connection){
          if (err) {
            _handler_err_Internal(err, res);
            console.log("error occured when getConnection for loading user Cognition Dialogues list.")
          }else{
            new Promise((resolve, reject)=>{
                console.log('loading req: Dialogues, inventory threads.');
                connection.query('SELECT * FROM threads WHERE id_participant = ?', [userId], function(err, rows, fields) {
                  if (err) {_handler_err_Internal(err, res);reject(err);return}
                  let sendingData = {
                      orderList: [],
                      dialoguesSet: {},
                      markBasic: {},
                      unitBasic: {},
                      userBasic: {},
                      temp: {threadsList:[], marksList:[], unitsList:[], authorsList:[], threadsByMarkId: {}}
                  };
                  if(rows.length > 0){
                    rows.forEach(function(row, index){
                        sendingData.temp.threadsList.push([row.id]);  //[] is for mysql query usage
                        sendingData.temp.threadsByMarkId[row.id_mark] = row.id;
                        sendingData.temp.marksList.push([row.id_mark]);  //[] is for mysql query usage
                    })
                    resolve(sendingData);
                  }else{
                    _res_success(res, sendingData);
                    connection.release();
                  }
                })
            }).then((sendingData)=>{
              let _db_selectFromDialogues = new Promise((resolve, reject)=>{
                console.log('loading req: Dialogues, pick last one.');
                let selectQuery = "SELECT id_thread, id_talker, editor_content, MAX(created) AS max_date FROM dialogues WHERE id_thread = ? AND id_talker = "+userId+" ORDER BY max_date";
                connection.query(selectQuery, [sendingData.temp.threadsList], function(err, rows, fields){
                  if (err) {_handler_err_Internal(err, res);reject(err);return} //only with "return" could assure the promise end immediately if there is any error.
                  resolve(rows);
                })
              });
              let _db_selectFromMarks = new Promise((resolve, reject)=>{
                console.log('loading req: Dialogues, get belonged mark.');
                let selectQuery = "SELECT id, id_unit, layer, editor_content, id_author FROM marks WHERE id = ?";
                connection.query(selectQuery, [sendingData.temp.marksList], function(err, rows, fields){
                  if (err) {_handler_err_Internal(err, res);reject(err);return} //only with "return" could assure the promise end immediately if there is any error.
                  resolve(rows);
                })
              });

              return Promise.all([_db_selectFromDialogues, _db_selectFromMarks]).then(
                (results)=>{
                  return new Promise((resolve, reject)=>{
                    let dialogueRows = results[0];
                    let marksRows = results[1];
                    dialogueRows.forEach((row, index)=>{
                      sendingData.orderList.push(row.id_thread);
                      sendingData.dialoguesSet[row.id_thread] = {
                        editorContent: JSON.parse(row.editor_content),
                        talkerId: row.id_talker,
                        created: row.max_date
                      }
                    });
                    marksRows.forEach((row, index)=>{
                      sendingData.temp.unitsList.push([row.id_unit]);
                      sendingData.temp.authorsList.push([row.id_author]);
                      sendingData.markBasic[sendingData.temp.threadsByMarkId[row.id]] = {
                        markId: row.id,
                        layer: row.layer,
                        editorContent: JSON.parse(row.editor_content),
                        unitId: row.id_unit,
                        authorId: row.id_author
                      }
                    })
                    resolve(sendingData);
                  })
                }
              )
            }).then((sendingData)=>{
              let _db_selectFromUnits = new Promise((resolve, reject)=>{
                console.log('loading req: Dialogues, get unit data.');
                let selectQuery = "SELECT id, id_author, url_pic_layer0, url_pic_layer1 FROM units WHERE id = ? ";
                connection.query(selectQuery, [sendingData.temp.unitsList], function(err, rows, fields){
                  if (err) {_handler_err_Internal(err, res);reject(err);return} //only with "return" could assure the promise end immediately if there is any error.
                  resolve(rows);
                })
              });
              let _db_selectFromUsers = new Promise((resolve, reject)=>{
                console.log('loading req: Dialogues, get author basic.');
                let selectQuery = "SELECT id, account FROM users WHERE id = ?";
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
                      sendingData.unitBasic[row.id]={
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
            }).then((sendingData)=>{
              _res_success(res, sendingData);
              connection.release();
            }).catch((err)=>{
              console.log("error occured during Cognition Dialogues list req promise: "+err)
              connection.release();
            });
          }
        })
      }
    })
}

module.exports = _handle_cognition_loading_dialogues
