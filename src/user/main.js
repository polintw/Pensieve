const express = require('express');
const main = express.Router();

const cognitionExecutive = require('./cognition/execute.js');
const actionExecutive = require('./action/execute.js');

main.use('/cognition', cognitionExecutive)

main.use('/action', actionExecutive)

module.exports = main;
