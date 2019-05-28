const express = require('express');
const main = express.Router();

const basicExecutive = require('./basic.js');

const srcExecutive = require('./src.js');
const authorExecutive = require('./author/execute.js');
const plainExecutive = require('./plain.js');

main.param("id", (req, res, next, id)=>{
  req.reqUnitId = id;
  next();
})

main.use('/:id/basic', basicExecutive)

main.use('/:id/author', authorExecutive)
main.use('/:id/src', srcExecutive)
main.use('/:id', plainExecutive)

module.exports = main;
