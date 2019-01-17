const express = require('express');
const main = express.Router();

const status = require('./status.js');
const pass = require('./pass.js');
const login = require('./login.js');
const registerExecutive = require('./register.js');

main.use('/login', login)

main.use('/register', registerExecutive)

main.use('/status', status)

main.use('/', pass)

module.exports = main;
