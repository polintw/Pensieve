const express = require('express');
const main = express.Router();

const editExecutive = require('./editing.js');
const accumulatedExecutive = require('./accumulated.js');

main.param("id", (req, res, next, id)=>{
  req.reqUnitId = id;
  next();
})

main.use('/accumulated', accumulatedExecutive)

main.use('/:id/editing', editExecutive)

//main.use('/', plainExecutive)

module.exports = main;
