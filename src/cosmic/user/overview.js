const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../../config/jwt.js');
const {connection_key} = require('../../../config/database.js');
const {_res_success} = require('../../utils/resHandler.js');
const {_handler_err_BadReq, _handler_err_Unauthorized, _handler_err_Internal} = require('../../utils/reserrHandler.js');

const database = mysql.createPool(connection_key);

function _handle_cosmic_userOverview(req, res){
  jwt.verify(req.headers['token'], verify_key, function(err, payload) {
    if (err) {
      _handler_err_Unauthorized(err, res)
    } else {
      let userId = payload.user_Id;
      let desiredUser = Number(req.query.id);// echo the type of userId from payload.
      if(!desiredUser){_handler_err_BadReq('invalid query.', res);return}//prevent the server crushing due to invalid query .
      if(userId == desiredUser){_handler_err_BadReq('Unmatch user token.', res);return}//cosmic should always browse someone "else"

      database.getConnection(function(err, connection){
        if (err) {
          _handler_err_Internal(err, res);
          console.log("error occured when getConnection in loading overview in Cosmic user.")
        }else{
          console.log('loading req: overview in Cosmic user.');

          let _promise_composeUserBasic = (tempData)=>{
            return new Promise((resolve, reject)=>{
              console.log('loading req: overview in Cosmic user, compose user basic.');
              let selectQuery = "SELECT id, account FROM users WHERE id = ?";
              connection.query(selectQuery, [tempData.temp.queriedId], function(err, rows, fields){
                if (err) {_handler_err_Internal(err, res);reject(err);return} //only with "return" could assure the promise end immediately if there is any error.
                console.log('database connection: success.')
                if(rows.length> 0){
                  rows.forEach((row, index)=>{
                    tempData.userBasic[row.id] = {
                      account: row.account
                    }
                  })
                  resolve(tempData);
                }else{
                  resolve(tempData);
                }
              })
            })
          };

          new Promise((resolve, reject)=>{
            let tempData={
              userBasic: {},
              temp: {queriedId: desiredUser}
            }
            _promise_composeUserBasic(tempData).then((tempData)=>{
              let sendingData = {
                userBasic: {},
                temp: {}
              }
              sendingData.userBasic = tempData.userBasic;
              resolve(sendingData);
            })
          }).then((sendingData)=>{
            _res_success(res, sendingData, "loading req: overview in Cosmic user, complete.");
            connection.release();
          }).catch((err)=>{
            console.log("error occured during overview in Cosmic user req promise: "+err)
            connection.release();
          });
        }
      })
    }
  })
};

module.exports = _handle_cosmic_userOverview
