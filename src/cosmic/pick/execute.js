const express = require('express');
const execute = express.Router();

const _handle_cosmic_pickNounRegular = require('./nounRegular.js');

execute.get('/noun/regular', function(req, res){
  console.log('get cosmic request: pick noun regular');
  _handle_cosmic_pickNounRegular(req, res);
})

module.exports = execute;
