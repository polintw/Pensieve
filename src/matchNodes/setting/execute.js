const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');

const _handle_PATCH_wish = require('./wish.js');
const _handle_DELETE_wish = require('./wish.js');
const _handle_PATCH_waiting = require('./waiting.js');
const _handle_DELETE_waiting = require('./waiting.js');

execute.patch('/wish', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose(`'matchNodes, PATCH: /wish' ${req.query.order? 'with query order.': '.'}`);
  _handle_PATCH_wish(req, res);
})

execute.delete('/wish', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('matchNodes, DELETE: /wish');
  _handle_DELETE_wish(req, res);
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
