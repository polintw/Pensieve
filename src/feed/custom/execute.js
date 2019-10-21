const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');

const _handle_GET_feed_customNew = require('./new.js');
const _handle_GET_feed_customSelected = require('./selected.js');

execute.get('/new', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('feed, GET: /custom/new ');
  _handle_GET_feed_customNew(req, res);
})

execute.get('/selected', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('feed, GET: /custom/selected ');
  _handle_GET_feed_customSelected(req, res);
})

module.exports = execute;
