const express = require('express');
const execute = express.Router();

const _handle_appearPath = require('./appearPath.js');

execute.get('/appearpath', function(req, res){
  console.log('get request for user cover: appearPath');
  _handle_appearPath(req, res);
})

module.exports = execute;
