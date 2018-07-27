const express = require('express');
const main = express.Router();
const fs = require('fs');
const path = require("path");
const jsonfile = require('jsonfile');
const update = require('immutability-helper');

const unitsListExecution = require('./unitsList/execute.js');

main.use('/unitsList', unitsListExecution)

module.exports = main;
