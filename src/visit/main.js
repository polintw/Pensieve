const express = require('express');
const main = express.Router();

const indexExecutive = require('./index.js');

main.use('/index', indexExecutive)

module.exports = main;
