const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');

const _handle_GET_feed_customNew = require('./new.js');

execute.get('/new', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('feed, GET: /custom/new ');
  _handle_GET_feed_customNew(req, res);
})

module.exports = execute;
