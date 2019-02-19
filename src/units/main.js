const express = require('express');
const main = express.Router();

const basicExecutive = require('./basic.js');
const vanilla = require('./vanilla.js');

main.param("id", (req, res, next, id)=>{
  req.reqUnitId = id;
  next();
})

main.use('/:id/basic', basicExecutive)

main.use('/:id', vanilla)

module.exports = main;
