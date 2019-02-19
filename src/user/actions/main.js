const express = require('express');
const main = express.Router();

const sharedsExecutive = require('./shareds/execute.js');

main.param("id", (req, res, next, id)=>{
  req.requesterId = id;
  console.log(req.requesterId);
  next();
})

main.use('/shareds', sharedsExecutive)


module.exports = main;
