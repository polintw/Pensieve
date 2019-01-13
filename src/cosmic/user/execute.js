const express = require('express');
const execute = express.Router();

const _handle_cosmic_userAppearPath = require('./appearPath.js');
const _handle_cosmic_userOverview = require('./overview.js');

execute.get('/appearpath', function(req, res){
  console.log('get cosmic request: user appearpath');
  _handle_cosmic_userAppearPath(req, res);
})
execute.get('/overview', function(req, res){
  console.log('get cosmic request: user overview');
  _handle_cosmic_userOverview(req, res);
})

module.exports = execute;
