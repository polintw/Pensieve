const express = require('express');
const main = express.Router();

const editExecutive = require('./editing.js');
const eraseExecutive = require('./erase.js');
const plainExecutive = require('./plain/plain.js');

main.param("id", (req, res, next, id)=>{
  req.reqUnitId = id;
  next();
})

main.use('/:id/editing', editExecutive)

main.use('/:id/erase', eraseExecutive)

main.use('/', plainExecutive)

module.exports = main;
