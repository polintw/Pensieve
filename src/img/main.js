const express = require('express');
const main = express.Router();
const winston = require('../../config/winston.js');

const _handle_img_requisition = require('./requisition.js');
const resizeExecutive = require('./resize.js');

main.use('/resize', resizeExecutive)

main.get('/:user/:ofWhich', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose(`GET: /img/user&file: ${req.params.user}/${req.params.ofWhich}`);
  _handle_img_requisition(req, res);
})


module.exports = main;
