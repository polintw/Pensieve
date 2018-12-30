const express = require('express');
const execute = express.Router();

const _handle_nouns_search = require('./simple.js');

execute.get('/simple', function(req, res){
  console.log('get public: noun search');
  _handle_nouns_search(req, res);
})


module.exports = execute;
