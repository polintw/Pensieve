const express = require('express');
const main = express.Router();

const basicExcutive = require('./basic.js');
const exploreExecutive = require('./explore.js');
const searchExecutive = require('./search/execute.js');
const plainExecutive = require('./plain.js');

main.use('/basic', basicExcutive)

main.use('/search', searchExecutive)

main.use('/explore', exploreExecutive)

main.param("id", (req, res, next, id)=>{
  req.reqNounId = id;
  next();
})

main.use('/:id', plainExecutive)

module.exports = main;
