const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../../config/jwt.js');
const {connection_key} = require('../../../config/database.js');
const {_handler_err_BadReq, _handler_err_Unauthorized, _handler_err_Internal} = require('../../utils/reserrHandler.js');

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

function _handle_cosmic_compoundIndex(req, res){
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
                connection.query('SELECT * FROM units', function(err, rows, fields) {
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
                      sendingData.unitsBasicSet[unitId] = {pic_layer0: row.url_pic_layer0, pic_layer1: row.url_pic_layer1}
                    })
                    resolve(sendingData)
                  } else {
                    resolve(sendingData)
                  }
                })
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

module.exports = _handle_cosmic_compoundIndex
