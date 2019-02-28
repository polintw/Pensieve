const express = require('express');
const main = express.Router();

const plainExecutive = require('./plain.js');

main.use('/', plainExecutive)

module.exports = main;
