const express = require('express');
const main = express.Router();

const sharedsExecutive = require('./shareds/execute.js');
const threadsExecutive = require('./threads.js');

main.param("id", (req, res, next, id)=>{
  req.requesterId = id;
  console.log(req.requesterId);
  next();
})

main.use('/shareds', sharedsExecutive)

main.use('/threads', threadsExecutive)


module.exports = main;
