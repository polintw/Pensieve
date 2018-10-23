const express = require('express');
const execute = express.Router();
const fs = require('fs');

const shareHandler_POST = require('./sharedsPOST.js');

execute.post('/', function(req, res){
  console.log('execute new share');
  shareHandler_POST(req, res);
})

module.exports = execute;
