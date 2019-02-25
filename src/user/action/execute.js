const express = require('express');
const execute = express.Router();
const fs = require('fs');
const path = require("path");

const _handle_action_newDialogue = require('./dialogue.js');

execute.post('/dialogue', function(req, res){
  console.log('action for posting: new dialogue');
  _handle_action_newDialogue(req, res);
})

module.exports = execute;
