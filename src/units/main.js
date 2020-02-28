const express = require('express');
const main = express.Router();

const srcExecutive = require('./single/src.js');
const singleExecutive = require('./single/single.js');
const numerousExecutive = require('./numerous.js')
main.param("id", (req, res, next, id)=>{
  req.reqUnitId = id;
  next();
})

main.use('/:id/src', srcExecutive)
main.use('/:id', singleExecutive)

main.use('/numerous', numerousExecutive)

module.exports = main;
