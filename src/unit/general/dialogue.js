const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../../config/jwt.js');
const {connection_key} = require('../../../config/database.js');
const {_handler_err_BadReq, _handler_err_Unauthorized, _handler_err_Internal} = require('../../handlers/reserrHandler.js');

const database = mysql.createPool(connection_key);

function _res_success(res, sendingData){
  let resData = {};
  resData['error'] = 0;
  resData['message'] = 'req success!';
  resData['main'] = sendingData;
  resData = JSON.stringify(resData);
  res.status(200).json(resData);
}

function _handle_unit_markDialogue(req, res){
  jwt.verify(req.headers['token'], verify_key, function(err, payload) {
    if (err) {
      _handler_err_Unauthorized(err, res)
    } else {
      let userId = payload.user_Id;
      database.getConnection(function(err, connection){
        if (err) {
          _handler_err_Internal(err, res);
          console.log("error occured when getConnection when handle dialogue req in unit/general.")
        }else{
          let sendingData = {
            threadId: null,
            orderList: [],
            dialoguesData: {},
            talkerAccount: {}
          };
          connection.query('SELECT * FROM threads WHERE (id_mark, id_participant) IN (?)', [[[req.query.markId, userId]]], function(err, result, fields) {
            if (err) {_handler_err_Internal(err, res);reject(err);}
            console.log('database connection: success.')
            if (result.length > 0) {
              sendingData['threadId'] = result[0].id;
              new Promise((resolve, reject)=>{
                console.log('dialogue req: select dialogue content.');
                connection.query('SELECT * FROM dialogues WHERE id_thread = ? ORDER BY created', [sendingData.threadId], function(err, rows, fields){
                  if (err) {_handler_err_Internal(err, res);reject(err);}
                  console.log('database connection: success.')
                  rows.forEach((row, index) => {
                      let obj = {
                          editorContent: JSON.parse(row.editor_content),
                          talker: row.id_talker
                      };
                      sendingData.dialoguesData[row.id] = obj;
                      sendingData.orderList.push(row.id);
                      if(!(row.id_talker in sendingData.talkerAccount)){sendingData.talkerAccount[row.id_talker] +=1 ;};
                  });
                  resolve(sendingData);
                })
              }).then((sendingData)=>{
                console.log('dialogue req: select talker account.');
                return new Promise((resolve, reject)=>{
                  let selectCondition = Object.keys(sendingData.talkerAccount);
                  selectCondition.map(function(key, index){
                    selectCondition[index] = "["+key+"]";
                  })
                  connection.query('SELECT account, id FROM users WHERE (id) IN (?)', [selectCondition], function(err, results, fields){
                    if (err) {_handler_err_Internal(err, res);reject(err);}
                    console.log('database connection: success.')
                    results.forEach((result,index)=>{
                      sendingData.talkerAccount[result.id] = result.account
                    })
                    resolve(sendingData)
                  })
                })
              }).then((sendingData)=>{
                _res_success(res, sendingData);
                connection.release();
              }).catch((err)=>{
                console.log("error occured during dialogue req promise: "+err)
                connection.release();
              });
            } else {
              sendingData.talkerAccount[userId] = true;
              _res_success(res, sendingData);
              connection.release();
            }
          })
        }
      })
    }
  })
}

module.exports = _handle_unit_markDialogue
