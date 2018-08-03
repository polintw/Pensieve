const express = require('express');
const execute = express.Router();
const fs = require('fs');
const path = require("path");
const jsonfile = require('jsonfile');
const update = require('immutability-helper');

const newShareHandler = require('./newShare.js');

execute.post('/new', function(req, res){
  console.log('execute new share');
  newShareHandler(req, res);
})

module.exports = execute;
