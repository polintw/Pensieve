const express = require('express');
const main = express.Router();

const assignExecutive = require('./assign/execute.js');

main.param("id", (req, res, next, id)=>{
  req.reqUnitId = id;
  next();
})

main.use('/:id', assignExecutive)


module.exports = main;
