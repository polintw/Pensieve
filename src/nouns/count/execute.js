const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');

const {_handle_GET_nounCount_users} = require('./users.js');

execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /nouns/:id/count, users.');
  let countItem = req.query.countItem;
  //expecting there would be more kind of request from nw on,
  //so using switch for easier scale
  switch (countItem) {
    case 'users':
      _handle_GET_nounCount_users(req, res);
      break;
    default:
      res.status(204).json({message: 'request accept but without valid params.'}); //"No Content", accept but nothing would happen without query
  }
})

module.exports = execute;
