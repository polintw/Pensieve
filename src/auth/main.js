const express = require('express');
const main = express.Router();

const login = require('./login.js');
const status = require('./status.js');
const verify = require('./verify.js');

main.use('/login', login)

main.use('/status', status)

main.use('/', verify)

module.exports = main;
