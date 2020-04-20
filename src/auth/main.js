const express = require('express');
const main = express.Router();

const status = require('./status.js');
const pass = require('./pass.js');
const refresh = require('./refresh.js');
const login = require('./login.js');
const registerExecutive = require('./register/execute.js');
const forgetExecutive = require('./forget/forget.js');

main.use('/login', login)

main.use('/refresh', refresh)

main.use('/forget', forgetExecutive)

main.use('/status', status)

main.use('/register', registerExecutive)

main.use('/', pass)

module.exports = main;
