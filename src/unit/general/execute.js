const express = require('express');
const execute = express.Router();

const _handle_unit_markDialogue = require('./dialogue.js');

execute.get('/dialogue', function(req, res){
  console.log('get dialogue request');
  _handle_unit_markDialogue(req, res);
})

module.exports = execute;
