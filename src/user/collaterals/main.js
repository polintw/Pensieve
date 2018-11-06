const express = require('express');
const main = express.Router();

const tracksExecutive = require('./tracks.js');

main.use('/tracks', tracksExecutive)

module.exports = main;
