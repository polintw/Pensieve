const express = require('express');
const main = express.Router();

const compoundExecutive = require('./compound/execute.js');


main.use('/compound', compoundExecutive)

module.exports = main;
