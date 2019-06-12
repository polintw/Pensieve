const express = require('express');
const main = express.Router();

const presentExcutive = require('./present.js');

main.use('/present', presentExcutive)

module.exports = main;
