const express = require('express');
const execute = express.Router();
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../config/jwt.js');
const winston = require('../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_users = require('../../db/models/index').users;
const _DB_notifications = require('../../db/models/index').notifications;
const _DB_lastvisitNotify = require('../../db/models/index').lastvisit_notify;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
} = require('../utils/reserrHandler.js');

function _handle_GET_notifications_list(req, res){
  new Promise((resolve, reject)=>{
    const reqToken = req.body.token || req.headers['token'] || req.query.token;
    const jwtVerified = jwt.verify(reqToken, verify_key);
    if (!jwtVerified) throw new internalError(jwtVerified, 32);

    let userId = jwtVerified.user_Id;

    return _DB_notifications.findAll({
      where: {
        id_reciever: userId
      },
      attributes: ['id_user','id_unit','type','status', 'createdAt'],
      limit: 7, //limit the results of the query
      order: [['createdAt', 'DESC']] //make sure the order of arr are from latest
    }).then((notifications)=>{
      // 2 things need to be sent
      //list include id of related user, & the account the id belong to
      let sendingData={
        notifyList: [],
        usersBasic: {},
        temp: {
          usersList: []
        }
      };
      sendingData.notifyList = notifications.map((row, index)=>{
        let userify = sendingData.temp['usersList'].includes(row.id_user);
        if(!userify) sendingData.temp['usersList'].push(row.id_user);

        return {
          type: row.type,
          status: row.status,
          userId: row.id_user,
          unitId: row.id_unit,
          createdAt: row.createdAt
        }
      });

      return sendingData;

    }).then((sendingData)=>{
      return _DB_users.findAll({
        where: {
          id: sendingData.temp.usersList
        },
        attributes: ['id','account','first_name','last_name'],
      }).then((users)=>{
        users.forEach((row, index)=>{
          sendingData.usersBasic[row.id] = {
            id: row.id,
            account: row.account,
            firstName: row.first_name,
            lastName: row.last_name
          }
        });

        return sendingData;
      }).catch((err)=>{
        throw err;
      });
    }).then((sendingData)=>{
      //and don't forget to update visit time by update ip---Sequelize will do the rest
      return _DB_lastvisitNotify.update(
        {ip: req.ip},
        {where: {id_user: userId}}
      ).then(()=>{
        resolve(sendingData);
      }).catch((err)=>{
        throw err;
      });
    }).catch((err)=>{
      reject(new internalError(err, 131));
    });

  }).then((sendingData)=>{
    _res_success(res, sendingData, "GET: /notifications/list, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /notifications/list ');
  _handle_GET_notifications_list(req, res);
})

module.exports = execute;
