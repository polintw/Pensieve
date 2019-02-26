const express = require('express');
const execute = express.Router();
const fs = require('fs');
const path = require("path");
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../config/jwt.js');
const winston = require('../../config/winston.js');
const _DB_inspired = require('../../db/models/index').inspired;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  forbbidenError,
  internalError,
  authorizedError,
  notFoundError
} = require('../utils/reserrHandler.js');

/*
connection.query('DELETE FROM inspired WHERE id_mark = ? AND id_user = ?', [markId, userId], function(err, result, fields) {
  if (err) {_handler_err_Internal(err, res);reject(err);}
  console.log('database connection: success.')
  resolve()
})
*/

function _handle_inspire_plain_POST(req, res){
  new Promise((resolve, reject)=>{
    const reqToken = req.body.token || req.headers['token'] || req.query.token;
    const jwtVerified = jwt.verify(reqToken, verify_key);
    if (!jwtVerified) throw new internalError(jwtVerified, 131)

    let userId = jwtVerified.user_Id;
    const markId = parseInt(req.query.markId);

    _DB_inspired.create({id_mark: markId, id_user: userId}).then(function(createdInspire) {
      resolve()
    })
  }).then(()=>{
    let sendingData ={
      temp:{}
    }
    _res_success(res, sendingData, "POST: inspire/ , complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

execute.post('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('POST: inspire/ ');
  _handle_inspire_plain_POST(req, res);
})

module.exports = execute;
