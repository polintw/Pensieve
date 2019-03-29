const express = require('express');
const execute = express.Router();
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../config/jwt.js');
const winston = require('../../config/winston.js');
const _DB_marks = require('../../db/models/index').marks;
const _DB_inspired = require('../../db/models/index').inspired;
const _DB_notifications = require('../../db/models/index').notifications;
const _DB_notifiInspired = require('../../db/models/index').notifi_inspired;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  forbbidenError,
  internalError,
  authorizedError,
  notFoundError
} = require('../utils/reserrHandler.js');

function _handle_inspire_plain_DELETE(req, res){
  new Promise((resolve, reject)=>{
    const reqToken = req.body.token || req.headers['token'] || req.query.token;
    const jwtVerified = jwt.verify(reqToken, verify_key);
    if (!jwtVerified) throw new internalError(jwtVerified, 131)

    const userId = jwtVerified.user_Id;
    const markId = parseInt(req.query.markId);

    _DB_inspired.destroy({
      where: {id_mark: markId, id_user: userId}
    }).then(function(createdInspire) {
      resolve()
    })
  }).then(()=>{
    let sendingData ={
      temp:{}
    }
    _res_success(res, sendingData, "DELETE: inspire/ , complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

function _handle_inspire_plain_POST(req, res){
  new Promise((resolve, reject)=>{
    const reqToken = req.body.token || req.headers['token'] || req.query.token;
    const jwtVerified = jwt.verify(reqToken, verify_key);
    if (!jwtVerified) throw new internalError(jwtVerified, 131)

    let userId = jwtVerified.user_Id;
    const markId = parseInt(req.query.markId);

    _DB_marks.findByPk(markId).then((mark)=>{
      if(mark.id_author == userId) throw new forbbidenError("Fail attempt.",36);
      return _DB_inspired.create({
        id_mark: markId,
        id_user: userId
      })
      .then(function(createdInspire) {
        return _DB_notifications.create({
          id_user:userId,
          id_unit: mark.id_unit,
          id_reciever:mark.id_author,
          type:'0_0', //first 0 for 'author of Unit/mark', and second for 'inspired'
          status: 'untouched'
        })
      })
      .then(()=>{
        return _DB_notifiInspired.create({
          id_unit: mark.id_unit,
          id_mark: markId,
          status: 'untouched'
        })
      })
      .then(()=>{
        resolve()
      })
    }).catch((error)=>{
      reject(error);
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

execute.delete('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('DELETE: inspire/ ');
  _handle_inspire_plain_DELETE(req, res);
})

module.exports = execute;
