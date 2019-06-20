const express = require('express');
const main = express.Router();

const basicExecutive = require('./basic.js');
const responsesExecutive = require('./responses.js');
const tracksExecutive = require('./tracks.js');
const broadsExecutive = require('./broads.js');

const srcExecutive = require('./src.js');
const plainExecutive = require('./plain/plain.js');

main.param("id", (req, res, next, id)=>{
  req.reqUnitId = id;
  next();
})

main.use('/:id/basic', basicExecutive)
main.use('/:id/responses', responsesExecutive)
main.use('/:id/track', tracksExecutive)
main.use('/:id/broad', broadsExecutive)

main.use('/:id/src', srcExecutive)
main.use('/:id', plainExecutive)

module.exports = main;
