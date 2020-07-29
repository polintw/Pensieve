const express = require('express');
const main = express.Router();

const editExecutive = require('./editing.js');
const eraseExecutive = require('./erase.js');
const staticsExecutive = require('./statics.js');
const plainExecutive = require('./plain/plain.js');
const accumulatedExecutive = require('./accumulated.js');

main.use('/accumulated', accumulatedExecutive)

main.param("id", (req, res, next, id)=>{
  req.reqUnitId = id;
  next();
})

main.use('/:id/editing', editExecutive)

main.use('/:id/erase', eraseExecutive)

main.use('/:id/statics', staticsExecutive)

main.use('/', plainExecutive)

module.exports = main;
