const express = require('express');
const main = express.Router();

const vanilla = require('./vanilla.js');

main.use('/', vanilla)


module.exports = main;
