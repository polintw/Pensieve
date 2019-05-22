const express = require('express');
const execute = express.Router();
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../../config/jwt.js');
const _DB_units = require('../../../db/models/index').units;
const _DB_users = require('../../../db/models/index').users;
const _DB_inspired = require('../../../db/models/index').inspired;
const {_res_success} = require('../../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
  forbbidenError
} = require('../../utils/reserrHandler.js');

function _handle_GET_author_inspired(req, res){
  new Promise((resolve, reject)=>{
    const reqToken = req.body.token || req.headers['token'] || req.query.token;
    const jwtVerified = jwt.verify(reqToken, verify_key);
    if (!jwtVerified) throw new internalError(jwtVerified, 32);

    const userId = jwtVerified.user_Id;
    const reqUnit = req.reqUnitId;
    const markId = parseInt(req.query.markId);

    //first, check the identify of the applyer
    return _DB_units.findOne({
      where: {id: reqUnit},
      attributes: ['id_author']
    }).then((result)=>{
      if(result.id_author !== userId){throw new forbbidenError("You are forbbiden to get this records.",87);}
      else {
        // then, get the inspired list
        let sendingData = {
          temp: {},
          usersList: [],
          usersBasic: {}
        };
        return _DB_inspired.findAll({
          where: {id_mark: markId},
          attributes: ['id_user']
        }).then((inspireds)=>{
          sendingData.usersList = inspireds.map((row, index)=>{
            return row.id_user;
          })
          return sendingData;
        }).catch((err)=>{
          throw err;
        });
      }
    }).then((sendingData)=>{
      //select info of related users
      return _DB_users.findAll({
        where: {
          id: sendingData.usersList
        },
        attributes: ['id','account','first_name','last_name']
      }).then((users)=>{
        users.forEach((row, index)=>{
          sendingData.usersBasic[row.id] = {
            id: row.id,
            account: row.account,
            firstName: row.first_name,
            lastName: row.last_name
          }
        });

        resolve(sendingData);
      }).catch((err)=>{
        throw err;
      });
    }).catch((err)=>{
      reject(new internalError(err, 131));
    });
  }).then((sendingData)=>{
    _res_success(res, sendingData, "GET: /units/:id/author/inspired, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

module.exports = _handle_GET_author_inspired;
