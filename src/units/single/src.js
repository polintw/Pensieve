const express = require('express');
const execute = express.Router();

const winston = require('../../../config/winston.js');
const _DB_units = require('../../../db/models/index').units;
const {_res_success} = require('../../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
} = require('../../utils/reserrHandler.js');

function _handle_GET_units_src(req, res){
  new Promise((resolve, reject)=>{
    //becuase we have verify the token at upper level,
    //and there is no need to use 'userId' in this function
    const reqExposedId = req.reqExposedId;

    return _DB_units.findOne({
      where: {exposedId: reqExposedId},
      attributes: ['url_pic_layer0', 'url_pic_layer1']
    }).then((result)=>{
      let sendingData = {
        temp: {},
        pic_layer0:result.url_pic_layer0,
        pic_layer1: result.url_pic_layer1 ? result.url_pic_layer1: false
      };

      resolve(sendingData);
    }).catch((err)=>{
      reject(new internalError(err, 131));
    });

  }).then((sendingData)=>{
    _res_success(res, sendingData, "GET: /units/:/src, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /units/:/src ');
  _handle_GET_units_src(req, res);
})

module.exports = execute;
