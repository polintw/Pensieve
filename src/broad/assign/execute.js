const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');

const _handle_GET_broadList = require('./list.js');
const _handle_POST_broad = require('./actions.js')._handle_POST_broad;
const _handle_PATCH_broad = require('./actions.js')._handle_PATCH_broad;

execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /broad, get usersList ');
  _handle_GET_broadList(req, res);
})

execute.post('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('POST: /broad, post actions ');
  _handle_POST_broad(req, res);
})

execute.patch('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('PATCH: /broad, patch(delete) actions ');
  _handle_PATCH_broad(req, res);
})

module.exports = execute;
