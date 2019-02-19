const express = require('express');
const main = express.Router();

const compoundExecutive = require('./compound.js');

main.use('/compound', compoundExecutive)

module.exports = main;
