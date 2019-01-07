const express = require('express');
const execute = express.Router();
const fs = require('fs');
const path = require("path");

const _handle_cognition_loading_Inspired = require('./loadInspired.js');
const _handle_cognition_loading_dialogues = require('./loadDialogues.js');

execute.get('/inspired', function(req, res){
  console.log('get request for cognition data: inspired');
  _handle_cognition_loading_Inspired(req, res);
})

execute.get('/dialogues', function(req, res){
  console.log('get request for cognition data: dialogues');
  _handle_cognition_loading_dialogues(req, res);
})

module.exports = execute;
