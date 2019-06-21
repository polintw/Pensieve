const express = require('express');
const main = express.Router();

const cognitionExecutive = require('./cognition/execute.js');
const coverExecutive = require('./cover/execute.js');
const actionExecutive = require('./action/execute.js');

main.use('/cognition', cognitionExecutive)

main.use('/cover', coverExecutive)

main.use('/action', actionExecutive)

module.exports = main;
