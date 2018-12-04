const express = require('express');
const execute = express.Router();
const jwt = require('jsonwebtoken');
const sharp = require('sharp');
const {verify_key} = require('../../config/jwt.js');
const {_res_success} = require('../utils/resHandler.js');
const {
  _handler_err_NotFound,
  _handler_err_BadReq,
  _handler_err_Unauthorized,
  _handler_err_Internal
} = require('../utils/reserrHandler.js');

function _handle_img_resize_POST(req, res){
  jwt.verify(req.headers['token'], verify_key, function(err, payload) {
    if (err) {
      _handler_err_Unauthorized(err, res)
    } else {
      let userId = payload.user_Id;
      let sendingData={
        resizedURL: "",
        temp: {}
      };
      let base64Splice = req.body.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let base64Buffer = new Buffer(base64Splice[2], 'base64');

      sharp(base64Buffer)
          .rotate()
          .resize({width: 2496, height: 2496, fit: 'inside'})  //define it to the size as 72 dpi on 26'' display
          .toBuffer({ resolveWithObject: true })
          .then(({data, info})=>{
            console.log("outputFormat: "+info.format+", outputSize: "+info.size);
            let imgBase64 = new Buffer(data, 'binary').toString('base64');
            sendingData.resizedURL = 'data:image/jpeg;base64,' + imgBase64;

            return sendingData;
          }).then((sendingData)=>{
            _res_success(res, sendingData, "Complete, POST: img/resize.");
          }).catch((errObj)=>{
            console.log("error occured during POST: img/resize promise: "+errObj.err)
            switch (errObj.status) {
              case 400:
                _handler_err_BadReq(errObj.err, res);
                break;
              case 404:
                _handler_err_NotFound(errObj.err, res);
                break;
              case 500:
                _handler_err_Internal(errObj.err, res);
                break;
              default:
                _handler_err_Internal(errObj.err?errObj.err:errObj, res);
            }
          });
    }
  })
}

execute.post('/', function(req, res){
  console.log('POST: img/resize');
  _handle_img_resize_POST(req, res);
})

module.exports = execute;
