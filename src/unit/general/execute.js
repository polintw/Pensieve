const express = require('express');
const execute = express.Router();

const _handle_unit_Mount = require('./mount.js');
const _handle_unit_markDialogue = require('./dialogue.js');
const _handle_unit_markAuthorThread = require('./threads.js');

execute.get('/mount', function(req, res){
  console.log('get unit request: '+ req.query.unitName);
  _handle_unit_Mount(req, res);
})

execute.get('/dialogue', function(req, res){
  console.log('get dialogue request');
  _handle_unit_markDialogue(req, res);
})

execute.get('/threads', function(req, res){
  console.log('get threads request');
  _handle_unit_markAuthorThread(req, res);
})

module.exports = execute;
