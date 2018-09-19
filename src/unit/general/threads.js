const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../../config/jwt.js');
const {connection_key} = require('../../../config/database.js');
const {_handler_err_BadReq, _handler_err_Unauthorized, _handler_err_Internal} = require('../../handlers/reserrHandler.js');

const database = mysql.createPool(connection_key);

function _res_success(res, sendingData){

  delete sendingData.temp;
  let resData = {};
  resData['error'] = 0;
  resData['message'] = 'req success!';
  resData['main'] = sendingData;
  resData = JSON.stringify(resData);
  res.status(200).json(resData);
}

function _handle_unit_markAuthorThread(req, res){
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
          new Promise((resolve, reject)=>{
            console.log('threads req: check identity.');
            connection.query('SELECT id_unit FROM marks WHERE id = ?', [req.query.markId], function(err, rows, fields) {
              if (err) {_handler_err_Internal(err, res);reject(err);}
              if(rows.length > 0){
                connection.query('SELECT id_author FROM units WHERE id = ? ', [rows[0].id_unit], function(err, rowsUnit, fields){
                  if (err) {_handler_err_Internal(err, res);reject(err);}
                  resolve(rowsUnit[0].id_author);
                })
              }else{
                _handler_err_BadReq(err, res);reject(err);
              }
            })
          }).then((authorId)=>{
            return new Promise((resolve, reject)=>{
              if(authorId == userId){
                console.log('threads req: select anything from threads.');
                connection.query('SELECT * FROM threads WHERE id_mark = ?', [req.query.markId], function(err, rows, fields) {
                  if (err) {_handler_err_Internal(err, res);reject(err);}
                  let sendingData = {
                    orderList: [],
                    participants: {},
                    threadsData: {},
                    temp:{threadsList: [], participantsList: []}
                  };
                  if(rows.length>0){
                    rows.forEach((row, index)=>{
                      sendingData.temp.threadsList.push([row.id]); //[] is for mysql query usage
                      sendingData.participants[row.id] = {};
                      sendingData.participants[row.id]['id'] = row.id_participant;
                      sendingData.temp.participantsList.push([row.id_participant]);
                    })
                    resolve(sendingData)
                  }else{
                    _res_success(res, sendingData);
                    connection.release();
                  }
                })
              }else{
                let err = "Error: unauthorized req for threads.";
                _handler_err_Unauthorized(err, res);reject(err);
              }
            })
          }).then((sendingData)=>{
            let _db_selectFromDialogues = new Promise((resolve, reject)=>{
              console.log('threads req: select dialogue preview.');
              let selectQuery = "SELECT id_thread, id_talker, editor_content, MAX(created) AS max_date FROM dialogues WHERE id_thread = ? ORDER BY max_date";
              connection.query(selectQuery, [sendingData.temp.threadsList], function(err, rows, fields){
                if (err) {_handler_err_Internal(err, res);reject(err);return} //only with "return" could assure the process end immediately if there is any error.
                resolve(rows);
              })
            })
            let _db_selectFromUsers = new Promise((resolve, reject)=>{
              console.log('threads req: select participants account.');
              let selectQuery = "SELECT id, account FROM users WHERE id = ? ";
              connection.query(selectQuery, [sendingData.temp.participantsList], function(err, rows, fields){
                if (err) {_handler_err_Internal(err, res);reject(err);return}
                let valuePairs = {}
                rows.forEach((row, index)=>{
                  valuePairs[row.id] = row.account
                })
                resolve(valuePairs);
              })
            })
            return Promise.all([_db_selectFromDialogues, _db_selectFromUsers]).then(
              (results)=>{
                return new Promise((resolve, reject)=>{
                  let dialogueRows = results[0];
                  let usersPairs = results[1];
                  dialogueRows.forEach((row, index) => {
                    sendingData.orderList.push(row.id_thread);
                    sendingData.threadsData[row.id_thread]={
                      editorContent: JSON.parse(row.editor_content),
                      talker: row.id_talker,
                      lastTime: row.max_date
                    }
                  });
                  sendingData.temp.threadsList.forEach((threadId, index)=>{
                    sendingData.participants[threadId]['account'] = usersPairs[sendingData.participants[threadId]['id']]
                  })
                  resolve(sendingData);
                })
              }
            )
          }).then((sendingData)=>{
            _res_success(res, sendingData);
            connection.release();
          }).catch((err)=>{
            console.log("error occured during dialogue req promise: "+err)
            connection.release();
          });
        }
      })
    }
  })
}

module.exports = _handle_unit_markAuthorThread
