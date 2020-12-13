const express = require('express');
const execute = express.Router();
const winston = require('../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_users = require('../../db/models/index').users;
const _DB_usersNodesHomeland = require('../../db/models/index').users_nodes_homeland;
const _DB_usersNodesResidence = require('../../db/models/index').users_nodes_residence;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  notFoundError
} = require('../utils/reserrHandler.js');

async function _handle_GET_people_basic(req, res){
  const reqUserId = req.query.userId;

  try{
    // validation: if the user id was valid
    const targetUser = await _DB_users.findOne({
      where: {id: reqUserId}
    });
    // if 'null' result -> not a valid pathName
    if(!targetUser){ //'null'
      throw new notFoundError("User you request was not found. Please use a valid user id.", 50);
      return; //stop and end the handler.
    };

    let usersStartNode = await _DB_usersNodesResidence.findOne({
      where: {
        id_user: targetUser.id,
        historyify: false
      }
    });
    if(!usersStartNode){ // 'null'
      usersStartNode = await _DB_usersNodesHomeland.findOne({
        where: {
          id_user: targetUser.id,
          historyify: false
        }
      });
    };

    let sendingData={
      nodeStart: usersStartNode.id_node,
      temp: {}
    };

    _res_success(res, sendingData, "GET: /people/basic, complete.");
  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return;
  }

}

execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /people/basic ');
  _handle_GET_people_basic(req, res);
})

module.exports = execute;
