const express = require('express');
const execute = express.Router();
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
} = require('../utils/reserrHandler.js');

const _DB_users = require('../../db/models/index').users;

function _handle_users_basic_GET(req, res){
  new Promise((resolve, reject)=>{
    let userId = req.extra.tokenUserId;
    let fetchList = req.query.fetchList;

    _DB_users.findAll({
      where: {id: fetchList},
      attributes: ["id", "account", "first_name","last_name"]
    })
    .then((results)=>{
      let sendingData={
        usersBasic:{},
        temp: {}
      };

      results.forEach((row, index)=>{
        sendingData.usersBasic[row.id] = {
          id: row.id,
          account: row.account,
          firstName: row.first_name,
          lastName: row.last_name
        };
      })

      resolve(sendingData);

    }).catch((err)=>{ //catch the error came from the whole
      reject(err);
    });
  }).then((sendingData)=>{
    _res_success(res, sendingData, "GET users: /basic, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });

}

execute.get('/basic', function(req, res){
  if (process.env.NODE_ENV == 'development') winston.verbose('GET users: /basic.');
  _handle_users_basic_GET(req, res);
})

module.exports = execute;
