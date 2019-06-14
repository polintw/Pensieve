const express = require('express');
const main = express.Router();

const basicExcutive = require('./basic.js');
const searchExecutive = require('./search/execute.js');
const contributeExecutive = require('./contributors.js');
const plainExecutive = require('./plain.js');

main.use('/basic', basicExcutive)

main.use('/search', searchExecutive)

main.param("id", (req, res, next, id)=>{
  req.reqNounId = id;
  next();
})

main.use('/:id/contributors', contributeExecutive)

main.use('/:id', plainExecutive)

module.exports = main;
