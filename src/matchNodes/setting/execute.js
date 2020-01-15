const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');
const {
  _handle_POST_taking,
  _handle_DELETE_taking
} = require('./taking.js');
const {
  _handle_PATCH_wish,
  _handle_DELETE_wish
} = require('./wish.js');
const {
  _handle_PATCH_willing,
  _handle_DELETE_willing
} = require('./willing.js');
const {
  _handle_PATCH_waiting,
  _handle_DELETE_waiting
} = require('./waiting.js');

execute.post('/taking', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose(`matchNodes, POST: /taking`);
  _handle_POST_taking(req, res);
})

execute.patch('/taking', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('matchNodes, PATCH: /taking');
  _handle_DELETE_taking(req, res);
})

execute.patch('/wish', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose(`matchNodes,  PATCH: /wish ' ${req.query.order? 'with query order.': '.'}${!!req.query.delete? 'aim to delete.':'.'}`);
  !!req.query.delete ? _handle_DELETE_wish(req, res): _handle_PATCH_wish(req, res);
})

execute.patch('/willing', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose(`matchNodes,  PATCH: /willing ' ${!!req.query.delete? 'aim to delete.':'.'}`);
  !!req.query.delete ? _handle_DELETE_willing(req, res): _handle_PATCH_willing(req, res);
})

execute.patch('/waiting', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose(`matchNodes,  PATCH: /waiting ' ${!!req.query.delete? 'aim to delete.':'.'}`);
  !!req.query.delete ? _handle_DELETE_waiting(req, res): _handle_PATCH_waiting(req, res);
})

module.exports = execute;
