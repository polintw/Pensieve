const express = require('express');
const main = express.Router();

const usersExcutive = require('./users.js');

main.use('/users', usersExcutive)

module.exports = main;
