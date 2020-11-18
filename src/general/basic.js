const express = require('express');
const execute = express.Router();
const winston = require('../../config/winston.js');
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
} = require('../utils/reserrHandler.js');
const _DB_users = require('../../db/models/index').users;
const _DB_paths = require('../../db/models/index').paths;


async function _handle_paths_basic_GET(req, res){
  const userId = req.extra.tokenUserId;
  let fetchList = req.query.fetchList;

  try{
    const pathsRows = await _DB_paths.findAll({
      where: {
        id: fetchList
      }
    });
    let sendingData={
      pathsBasic:{},
      temp: {}
    };

    pathsRows.forEach((row, index) => {
      sendingData.pathsBasic[row.id] ={
        id: row.id,
        pathProject: row.name,
        pathName: row.pathName
      }
    });

    _res_success(res, sendingData, "GET: basic: /paths, complete.");
  }
  catch(error){
    _handle_ErrCatched(error, req, res);
  }
}

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
    _res_success(res, sendingData, "GET basic: /users, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });

}

execute.get('/users', function(req, res){
  if (process.env.NODE_ENV == 'development') winston.verbose('GET basic: /users.');
  _handle_users_basic_GET(req, res);
})

execute.get('/paths', function(req, res){
  if (process.env.NODE_ENV == 'development') winston.verbose('GET basic: /paths.');
  _handle_paths_basic_GET(req, res);
})

module.exports = execute;
