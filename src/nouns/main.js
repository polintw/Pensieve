const express = require('express');
const main = express.Router();

const basicExcutive = require('./basic.js');
const countExecutive = require('./count/execute.js');
const searchExecutive = require('./search/execute.js');
const directExecutive = require('./direct.js');
const accumulatedExecutive = require('./accumulated.js');
const attributeExecutive = require('./attribution.js');

main.use('/basic', basicExcutive)

main.use('/search', searchExecutive)

main.use('/direct', directExecutive)

main.use('/accumulated', accumulatedExecutive)

main.param("id", (req, res, next, id)=>{
  req.reqNounId = id;
  next();
})

main.use('/:id/attribution', attributeExecutive)

main.use('/:id/count', countExecutive)


module.exports = main;
