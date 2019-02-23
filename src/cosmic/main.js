const express = require('express');
const main = express.Router();

const compoundExecutive = require('./compound.js');
const userExecutive = require('./user/execute.js');
const pickExecutive = require('./pick/execute.js');

main.use('/compound', compoundExecutive)

main.use('/pick/user', userExecutive)

main.use('/pick', pickExecutive)

module.exports = main;
