const express = require('express');
const main = express.Router();

const threadsExecutive = require('./threads.js');

main.param("id", (req, res, next, id)=>{
  req.requesterId = id;
  console.log(req.requesterId);
  next();
})

main.use('/threads', threadsExecutive)


module.exports = main;
