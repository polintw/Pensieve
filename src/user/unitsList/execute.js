const express = require('express');
const execute = express.Router();
const fs = require('fs');
const path = require("path");
const jsonfile = require('jsonfile');
const update = require('immutability-helper');

const _promise_unitLtd = require('./ltd.js');
const _promise_readCabinet = require('./cabinet.js');

execute.get('/ltd', function(req, res){
  console.log('get units list request for ltd');
  _promise_unitLtd(req, res);
})

execute.get('/cabinet', function(req, res){
  console.log('get units list request for Cabinet: '+ req.query.focus);
  let focus = req.query.focus;
  _promise_readCabinet(req, res, focus);
})

module.exports = execute;
