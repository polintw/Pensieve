const express = require('express');
const main = express.Router();

const presentExcutive = require('./present.js');
const userExecutive = require('./user/execute.js');

main.use('/present', presentExcutive)

main.use('/pick/user', userExecutive)

module.exports = main;
