const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');

const _handle_GET_matchNodes_supply = require('./supply.js');

execute.get('/supply', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('options, GET: /matchNodes/supply ');
  _handle_GET_matchNodes_supply(req, res);
})


module.exports = execute;
