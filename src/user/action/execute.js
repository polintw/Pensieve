const express = require('express');
const execute = express.Router();
const fs = require('fs');
const path = require("path");

const _handle_actionInspired = require('./inspired.js');

execute.post('/inspired', function(req, res){
  console.log('action for posting: inspired');
  _handle_actionInspired(req, res);
})

module.exports = execute;
