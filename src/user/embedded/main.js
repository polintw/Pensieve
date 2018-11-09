const express = require('express');
const main = express.Router();

const broadsExecutive = require('./broads.js');

main.param("id", (req, res, next, id)=>{
  req.requesterId = id;
  console.log(req.requesterId);
  next();
})

main.use('/broads', broadsExecutive)

module.exports = main;
