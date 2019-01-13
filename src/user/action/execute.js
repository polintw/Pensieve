const express = require('express');
const execute = express.Router();
const fs = require('fs');
const path = require("path");

const _handle_actionInspired = require('./inspired.js');
const _handle_action_newDialogue = require('./dialogue.js');

execute.post('/inspired', function(req, res){
  console.log('action for posting: inspired');
  _handle_actionInspired(req, res);
})

execute.post('/dialogue', function(req, res){
  console.log('action for posting: new dialogue');
  _handle_action_newDialogue(req, res);
})

module.exports = execute;
