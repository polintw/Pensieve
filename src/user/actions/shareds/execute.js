const express = require('express');
const execute = express.Router();

const _handle_user_actionsShareds_GET = require('./sharedsGET.js');

execute.get('/', function(req, res){
  console.log('GET: user actions/shareds');
  _handle_user_actionsShareds_GET(req, res);
})

module.exports = execute;
