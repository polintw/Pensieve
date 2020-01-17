const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');

const {
  _handle_GET_nounsStatics_Belong
} = require('./belong.js');

execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /nouns/:id/statics, belong.');
  let request = req.query.request;
  //expecting there would be more kind of request from nw on,
  //so using switch for easier scale
  switch (request) {
    case 'belong':
      _handle_GET_nounsStatics_Belong(req, res);
      break;
    default:
      res.status(204).json(resData); //"No Content", accept but nothing would happen without query
  }
})


module.exports = execute;
