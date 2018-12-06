const express = require('express');
const main = express.Router();

const _handle_img_requisition = require('./requisition.js');
const resizeExecutive = require('./resize.js');

main.use('/resize', resizeExecutive)

main.get('/:user/:ofWhich', function(req, res){
  console.log('get img request: '+req.query.type);
  _handle_img_requisition(req, res);
})


module.exports = main;
