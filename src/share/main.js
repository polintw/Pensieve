const express = require('express');
const main = express.Router();

const inspiredExecutive = require('./inspired.js');
const editExecutive = require('./editing.js');
const staticsExecutive = require('./statics.js');
const accumulatedExecutive = require('./accumulated.js');
const plainExecutive = require('./plain/plain.js');

main.param("id", (req, res, next, id)=>{
  req.reqUnitId = id;
  next();
})

main.use('/accumulated', accumulatedExecutive)

main.use('/:id/editing', editExecutive)

main.use('/:id/inspired', inspiredExecutive)

main.use('/:id/statics', staticsExecutive)

main.use('/', plainExecutive)

module.exports = main;
