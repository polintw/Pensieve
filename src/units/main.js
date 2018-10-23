const express = require('express');
const main = express.Router();

const basicExecutive = require('./basic.js');
const responsesExecutive = require('./responses.js');

main.param("id", (req, res, next, id)=>{
  req.reqUnitId = id;
  next();
})

main.use('/:id/basic', basicExecutive)
main.use('/:id/responses', responsesExecutive)

module.exports = main;
