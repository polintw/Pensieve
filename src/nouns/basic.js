const express = require('express');
const execute = express.Router();
const winston = require('../../config/winston.js');
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
} = require('../utils/reserrHandler.js');

const _DB_nouns = require('../../db/models/index').nouns;

function _handle_nouns_basic_GET(req, res){
  new Promise((resolve, reject)=>{
    let userId = req.extra.tokenUserId;
    let fetchList = req.query.fetchList;

    _DB_nouns.findAll({
      where: {id: fetchList},
    })
    .then((results)=>{
      let sendingData={
        nounsBasic:{},
        temp: {}
      };

      results.forEach((row, index)=>{
        sendingData.nounsBasic[row.id] = {
          id: row.id,
          name: row.name,
          prefix: row.prefix,
          parentify: (row.parent ? true : false),
          childify: (row.child ? true : false)
        };
      })

      resolve(sendingData);

    }).catch((err)=>{ //catch the error came from the whole
      reject(err);
    });
  }).then((sendingData)=>{
    _res_success(res, sendingData, "GET nouns: /basic, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });

}

execute.get('/', function(req, res){
  if (process.env.NODE_ENV == 'development') winston.verbose('GET nouns: /basic.');
  _handle_nouns_basic_GET(req, res);
})

module.exports = execute;
