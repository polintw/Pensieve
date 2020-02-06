const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');

const _handle_GET_options_Belong = require('./belong.js');
const _handle_GET_options_Hot = require('./hot.js');

execute.get('/belong', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('options, GET: /nodes/belong ');
  _handle_GET_options_Belong(req, res);
})

execute.get('/hot', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('options, GET: /nodes/hot ');
  _handle_GET_options_Hot(req, res);
})

module.exports = execute;
