const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');

const _handle_GET_author_inspired = require('./inspired.js');

execute.get('/inspired', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /units/:id/author/inspired ');
  _handle_GET_author_inspired(req, res);
})


module.exports = execute;
