const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');

const _handle_GET_feed_customNew = require('./new.js');
const _handle_GET_feed_customSelected = require('./selected.js');
const _handle_GET_feed_customTodayNode = require('./todayNode.js');

execute.get('/new', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('feed, GET: /custom/new ');
  _handle_GET_feed_customNew(req, res);
})

execute.get('/selected', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('feed, GET: /custom/selected ');
  _handle_GET_feed_customSelected(req, res);
})

execute.get('/todayNode', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('feed, GET: /custom/todayNode');
  _handle_GET_feed_customTodayNode(req, res);
})

module.exports = execute;
