const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');

const _handle_GET_feed_optionsBelong = require('./belong.js');

execute.get('/belong', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /feed/options/belong ');
  _handle_GET_feed_optionsBelong(req, res);
})


module.exports = execute;
