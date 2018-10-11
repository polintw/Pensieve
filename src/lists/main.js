const express = require('express');
const main = express.Router();

const nounsExecutive = require('./nouns/execute.js');

main.use('/nouns', nounsExecutive)

module.exports = main;
