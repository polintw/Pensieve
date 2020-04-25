const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');
const _DB_belongInvitation = require('../../../db/models/index').belongs_invitation;
const _DB_usersNodesResidence = require('../../../db/models/index').users_nodes_residence;
const _DB_usersNodesHomeland = require('../../../db/models/index').users_nodes_homeland;
const {_res_success} = require('../../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
  notFoundError,
  forbbidenError,
  validationError
} = require('../../utils/reserrHandler.js');

async function _handle_GET_invitationFellows(req, res){
  const userId = req.extra.tokenUserId;
  const reqType= req.query.belongType;
  // no need to validate any thing, select directly
  try{
    const selected = await _DB_belongInvitation.findOne({
      where: {
        id_user: userId,
        belongType: reqType
      }
    });
    if(!selected){ //means the result is 'null'
      throw new notFoundError({warning: "The link did not generate correctly or something went wrong. Please try again."},34);
    }
    let sendingData={
      invitingLink: selected.exposedKey,
      temp: {}
    };
    _res_success(res, sendingData, "GET: user invitation/fellows, complete.");
  }
  catch(error){
    _handle_ErrCatched(error, req, res);
  }
}

async function _handle_PATCH_invitationFellows(req, res){
  const userId = req.extra.tokenUserId;
  /*
  validation? does belongType in ['homeland', 'residence']
  select if user has the record of this type with same node in belongs_invitation
  if not selected--- not the same node, or no this type, create a new
  */
  const validTypes = ['homeland', 'residence'];
  const reqType= req.body.belongType;
  if(validTypes.indexOf(reqType) < 0){ // the type req was not allowed
    _handle_ErrCatched(new validationError("The type you requested is not exist. Please select an allowed Type", 15), req, res);
    return; //stop and end the handler.
  };
  //then select the user's belongs, checking if the user req a belong had set
  const selectionOptions = {
    homeland:  (condition)=>{return _DB_usersNodesHomeland.findOne(condition)},
    residence:  (condition)=>{return _DB_usersNodesResidence.findOne(condition)},
  };
  const selectionByType = ()=>{
    let chosen = selectionOptions[reqType];
    let condition = {where:{id_user: userId, historyify: false}};
    return chosen(condition);
  };
  const reqBelong = await selectionByType();
  if( !reqBelong ){ // the type req did not be set yet
    _handle_ErrCatched(new forbbidenError("You hasn't set your belonged corner to "+reqType+". Set it first before generating invitation.", 73), req, res);
    return; //stop and end the handler.
  };
  //then we start to see if the req type has record
  const inviteRecord = await _DB_belongInvitation.findOne({
    where: {
      id_user: userId,
      id_node: reqBelong.id_node,
      belongType: reqType
    }
  });
  if(!!inviteRecord){ //if the result is not 'null', which means it has already the desire link
    //we don't need to do anything or res anything,
    // there is another api would req for the link
    let sendingData={
      temp: {}
    };
    _res_success(res, sendingData, "PATCH: user invitation/fellows, complete.");
    return; //success and end the handler.
  };
  //then, if no matched recored exist, create a new one
  _DB_belongInvitation.create({
    id_user: userId,
    id_node: reqBelong.id_node,
    belongType: reqType
  }).then((created)=>{
    let sendingData={
      temp: {}
    };
    _res_success(res, sendingData, "PATCH: user invitation/fellows, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

execute.patch('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('PATCH: user invitation/fellows.');
  _handle_PATCH_invitationFellows(req, res);
})

execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: user invitation/fellows.');
  _handle_GET_invitationFellows(req, res);
})

module.exports = execute;
