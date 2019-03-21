const express = require('express');
const execute = express.Router();
const fs = require('fs');
const path = require("path");

const _handle_cognition_loading_dialogues = require('./loadDialogues.js');

execute.get('/dialogues', function(req, res){
  console.log('get request for cognition data: dialogues');
  _handle_cognition_loading_dialogues(req, res);
})

module.exports = execute;
