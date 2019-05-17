const express = require('express');
const execute = express.Router();
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../config/jwt.js');
const winston = require('../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_notifications = require('../../db/models/index').notifications;
const _DB_lastvisitNotify = require('../../db/models/index').lastvisit_notify;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
} = require('../utils/reserrHandler.js');

function _handle_GET_notifications_count(req, res){
  new Promise((resolve, reject)=>{
    const reqToken = req.body.token || req.headers['token'] || req.query.token;
    const jwtVerified = jwt.verify(reqToken, verify_key);
    if (!jwtVerified) throw new internalError(jwtVerified, 32);

    let userId = jwtVerified.user_Id;

    return _DB_lastvisitNotify.findOne({
      where:{id_user: userId},
      attributes: ['updatedAt']
    }).then((lastVisit)=>{
      return _DB_notifications.findAndCountAll({
        where: {
          id_reciever: userId,
          createdAt: {[Op.gt]: lastVisit.updatedAt}
        }
      }).catch((err)=>{
        throw err;
      });
    }).then((notifications)=>{
      let sendingData={
        notifyCount: notificaions.count,
        temp: {}
      };
      return sendingData;

    }).then((sendingData)=>{
      //and don't forget to update visit time by update ip---Sequelize will do the rest
      return _DB_lastvisitNotify.update(
        {ip: req.ip},
        {where: {id_user: userId}}
      );
    }).then((sendingData)=>{
      resolve(sendingData);
    }).catch((err)=>{
      reject(new internalError(err, 131));
    });

  }).then((sendingData)=>{
    _res_success(res, sendingData, "GET: /notifications/count, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /notifications/count ');
  _handle_GET_notifications_count(req, res);
})

module.exports = execute;
