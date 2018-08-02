const express = require('express');
const execute = express.Router();
const fs = require('fs');
const path = require("path");
const jsonfile = require('jsonfile');
const update = require('immutability-helper');

const {_promise_unitMount} = require('./mount.js');

execute.get('/mount', function(req, res){
  console.log('get unit request: '+ req.query.unitName);
  _promise_unitMount(req, res);
})

module.exports = execute;
