const express = require('express');
const main = express.Router();

const passwordExecutive = require('./password.js');


main.use('/password', passwordExecutive)

module.exports = main;
