const express = require('express');
const execute = express.Router();
const fs = require('fs');
const path = require("path");

const _promise_unitLtd = require('./lookout.js');
const _promise_loadShared = require('./loadShared.js');

execute.get('/lookout', function(req, res){
  console.log('get request for cognition data: lookout');
  _promise_unitLtd(req, res);
})

execute.get('/shared', function(req, res){
  console.log('get request for cognition data: shared');
  _promise_loadShared(req, res);
})

module.exports = execute;
