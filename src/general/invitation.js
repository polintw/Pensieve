const express = require('express');
const execute = express.Router();
const winston = require('../../config/winston.js');
const _DB_users = require('../../db/models/index').users;
const _DB_nodes = require('../../db/models/index').nouns;
const _DB_belongInvitation = require('../../db/models/index').belongs_invitation;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
  notFoundError,
} = require('../utils/reserrHandler.js');

async function _handle_GET_invititationFellows(req, res){
  const userId = req.extra.tokenUserId;
  const invitingKey= req.query.invitingKey;
  // no need to validate any thing, select directly
  try{
    const selected = await _DB_belongInvitation.findOne({
      where: {
        exposedKey: invitingKey
      }
    });
    if(!selected){ //means the result is 'null'
      throw new notFoundError( "Your invitation was not clear.", 34);
    };

    //because this api was usually req under no token situation,
    //we then have to res userBasic & nodeBasic as well
    const userRow = await _DB_users.findOne({
      where: {id: selected.id_user}
    });
    const nodeRow = await _DB_nodes.findOne({
      where: {id: selected.id_node}
    });

    let userBasic = {
      id: userRow.id,
      account: userRow.account,
      firstName: userRow.first_name,
      lastName: userRow.last_name
    };
    let nodeBasic = {
      id: nodeRow.id,
      name: nodeRow.name,
      prefix: nodeRow.prefix
    }

    let sendingData={
      userBasic: userBasic,
      nodeBasic: nodeBasic,
      belongType: selected.belongType,
      temp: {}
    };
    _res_success(res, sendingData, "GET: general invitation/fellows, complete.");
  }
  catch(error){
    _handle_ErrCatched(error, req, res);
  }
}

execute.get('/fellows', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: general invitation/fellows.');
  _handle_GET_invititationFellows(req, res);
})

module.exports = execute;
