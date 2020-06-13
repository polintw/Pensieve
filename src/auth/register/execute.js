const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');

const _handle_auth_register_POST = require('./register');
const {
  _handle_auth_mailConfirm_GET,
  _handle_auth_mailResend_PATCH
} = require('./mail.js');
const _handle_PATCH_userStatusOnBoard = require('./onboard.js');

execute.get('/mail/confirm', function(req, res){
  console.log('GET: register/confirm mail');
  _handle_auth_mailConfirm_GET(req, res);
})

execute.patch('/mail/resend', function(req, res){
  console.log('GET: register/resend mail');
  _handle_auth_mailResend_PATCH(req, res);
})

execute.patch('/onboard', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('PATCH: register, /onboard');
  _handle_PATCH_userStatusOnBoard(req, res);
})

execute.post('/', function(req, res){
  console.log('POST: register');
  _handle_auth_register_POST(req, res);
})

module.exports = execute;
