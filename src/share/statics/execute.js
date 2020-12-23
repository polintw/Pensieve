const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');
const _handle_GET_share_staticsSum = require('./sum.js');
const _handle_GET_share_staticsInspired = require('./inspired.js');

// in this api, we have already checked if the use was author, along with the user's verification
// no need to checked again in followed handler
execute.get('/sum', function (req, res) {
  if (process.env.NODE_ENV == 'development') winston.verbose('GET: /share/statics, sum.');
  _handle_GET_share_staticsSum(req, res);
})

execute.get('/inspired', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /share/statics, inspired.');
  _handle_GET_share_staticsInspired(req, res);
})

module.exports = execute;
