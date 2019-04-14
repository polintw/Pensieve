const express = require('express');
const main = express.Router();

const basicExecutive = require('./basic.js');
const plainExecutive = require('./plain.js');

main.param("id", (req, res, next, id)=>{
  req.reqUnitId = id;
  next();
})

main.use('/:id/basic', basicExecutive)

main.use('/:id', plainExecutive)

module.exports = main;
