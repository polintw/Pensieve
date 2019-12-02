const express = require('express');
const execute = express.Router();

const winston = require('../../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_broads = require('../../../db/models/index').broads;
const {_res_success} = require('../../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
} = require('../../utils/reserrHandler.js');

function _handle_GET_broadList(req, res){
  new Promise((resolve, reject)=>{
    const userId = req.extra.tokenUserId;

    const reqUnitId = req.reqUnitId; //unit we now focus on

    _DB_broads.findAll({
      where: {id_unit: reqUnitId}
    })
    .then((results)=>{
      //in this api, we just res the usersList to client
      let sendingData={
        usersList: [],
        temp: {}
      }

      sendingData.usersList = results.map((row, index)=>{
        return row.id_user;
      })

      resolve(sendingData);
    }).catch((err)=>{
      reject(new internalError(err, 131));
    });

  }).then((sendingData)=>{
    _res_success(res, sendingData, "GET: /broad, get usersList, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

module.exports = _handle_GET_broadList;
