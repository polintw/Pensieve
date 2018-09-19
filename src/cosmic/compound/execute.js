const express = require('express');
const execute = express.Router();

const _handle_cosmic_compoundIndex = require('./index.js');

execute.get('/index', function(req, res){
  console.log('get cosmic request: compound index');
  _handle_cosmic_compoundIndex(req, res);
})

module.exports = execute;
