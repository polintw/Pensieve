const express = require('express');
const main = express.Router();
const fs = require('fs');
const path = require("path");
const jsonfile = require('jsonfile');
const update = require('immutability-helper');

const cognitionExecutive = require('./cognition/execute.js');
const shareExecutive = require('./shareds/execute.js');

main.param("id", (req, res, next, id)=>{
  req.requesterId = id;
  console.log(req.requesterId);
  next();
})

main.use('/:id/shareds', shareExecutive)

main.use('/cognition', cognitionExecutive)

module.exports = main;
