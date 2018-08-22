const express = require('express');
const main = express.Router();
const fs = require('fs');
const path = require("path");
const jsonfile = require('jsonfile');
const update = require('immutability-helper');

const generalExecutive = require('./general/execute.js');

main.use('/general', generalExecutive)

module.exports = main;
