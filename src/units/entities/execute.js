const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');
const _handle_GET_units_entitySubCates = require('./subcates.js');
const {
  _handle_GET_units_entitySign_list,
  _handle_GET_units_entitySign_userSign,
  _handle_POST_units_entitySign_userSign,
  _handle_DELETE_units_entitySign_userSign
} = require('./signSubcate.js');

execute.get('/subcates', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /units/entity, subCates.');
  _handle_GET_units_entitySubCates(req, res);
})

execute.get('/sign_subcate/list', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /units/entity, sign_subcate/list.');
  _handle_GET_units_entitySign_list(req, res);
})

execute.get('/sign_subcate/usersign', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /units/entity, sign_subcate/usersign.');
  _handle_GET_units_entitySign_userSign(req, res);
})

execute.post('/sign_subcate/usersign', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('POST: /units/entity, sign_subcate/usersign.');
  _handle_POST_units_entitySign_userSign(req, res);
})

execute.delete('/sign_subcate/usersign', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('DELETE: /units/entity, sign_subcate/usersign.');
  _handle_DELETE_units_entitySign_userSign(req, res);
})

module.exports = execute;
