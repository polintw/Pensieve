const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');
const _handle_GET_share_staticsInspired = require('./inspired.js');

execute.get('/subcates', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /units/entity, subCates.');
  _handle_GET_units_entitySubCates(req, res);
})

module.exports = execute;
