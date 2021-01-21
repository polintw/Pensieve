const express = require('express');
const execute = express.Router();
const winston = require('../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_users = require('../../db/models/index').users;
const _DB_units = require('../../db/models/index').units;
const _DB_inspireds = require('../../db/models/index').inspireds;
const _DB_usersNodesHomeland = require('../../db/models/index').users_nodes_homeland;
const _DB_usersNodesResidence = require('../../db/models/index').users_nodes_residence;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  notFoundError
} = require('../utils/reserrHandler.js');

async function _handle_GET_people_basic(req, res){
  const reqUserId = !!req.query.userId ? req.query.userId : null;
  const tokenId = req.extra.tokenify ? req.extra.tokenUserId : null; // userId passed from pass.js(no token is possible)

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
    let unitsShareds = await _DB_units.findAll({
      where: {
        id_author: targetUser.id,
        author_identity: 'user'
      }
    });
    let unitsList = unitsShareds.map((row, index)=> {
      return row.id;
    });
    let inspireds = await _DB_inspireds.findAll({
      where: {id_unit: unitsList},
      attributes: ['id_user'],
      group: 'id_user',
    });
    let inspiredsPeople = inspireds.map((row,index)=>{
      return row.id_user;
    })

    let userYear, userMonth;
    let d = new Date(targetUser.createdAt);
    userYear = d.getFullYear();

    let sendingData={
      nodeStart: usersStartNode.id_node,
      userBasicInfo: {
        timeCreate: userYear,
        countShareds: !!unitsShareds ? unitsShareds.length : 0,
        inspiredCount: inspiredsPeople.length,
        inspiredYou: (inspiredsPeople.indexOf(tokenId) < 0) ? false : true
      },
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
