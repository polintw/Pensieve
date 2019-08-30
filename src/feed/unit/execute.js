const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');

const _handle_GET_feed_unitRelated = require('./related.js');

execute.get('/related', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /feed/unit/related ');
  _handle_GET_feed_unitRelated(req, res);
})


module.exports = execute;
