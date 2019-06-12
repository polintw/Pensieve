const express = require('express');
const main = express.Router();

const nounsExcutive = require('./nouns.js');
const usersExcutive = require('./users.js');

main.use('/nouns', nounsExcutive)
main.use('/users', usersExcutive)

module.exports = main;
