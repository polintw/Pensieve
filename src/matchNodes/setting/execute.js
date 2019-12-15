const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');

const _handle_PATCH_taking = require('./taking.js');
const _handle_DELETE_taking = require('./taking.js');
const _handle_PATCH_wish = require('./wish.js');
const _handle_DELETE_wish = require('./wish.js');
const _handle_PATCH_willing = require('./willing.js');
const _handle_DELETE_willing = require('./willing.js');
const _handle_PATCH_waiting = require('./waiting.js');
const _handle_DELETE_waiting = require('./waiting.js');

execute.post('/taking', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose(`matchNodes, PATCH: /taking`);
  _handle_PATCH_taking(req, res);
})

execute.delete('/taking', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('matchNodes, DELETE: /taking');
  _handle_DELETE_taking(req, res);
})

execute.patch('/wish', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose(`'matchNodes, PATCH: /wish' ${req.query.order? 'with query order.': '.'}`);
  _handle_PATCH_wish(req, res);
})

execute.delete('/wish', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('matchNodes, DELETE: /wish');
  _handle_DELETE_wish(req, res);
})

execute.patch('/willing', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose(`matchNodes, PATCH: /willing`);
  _handle_PATCH_willing(req, res);
})

execute.delete('/willing', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('matchNodes, DELETE: /willing');
  _handle_DELETE_willing(req, res);
})

execute.patch('/waiting', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose(`matchNodes, PATCH: /waiting`);
  _handle_PATCH_waiting(req, res);
})

execute.delete('/waiting', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('matchNodes, DELETE: /waiting');
  _handle_DELETE_waiting(req, res);
})

module.exports = execute;
