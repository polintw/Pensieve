const express = require('express');
const main = express.Router();

const nounsExcutive = require('./nouns.js');

main.use('/nouns', nounsExcutive)

module.exports = main;
