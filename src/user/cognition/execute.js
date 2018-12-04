const express = require('express');
const execute = express.Router();

const _promise_loadShared = require('./loadShared.js');

execute.get('/shared', function(req, res){
  console.log('get request for cognition data: shared');
  _promise_loadShared(req, res);
})

module.exports = execute;
