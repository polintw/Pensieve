const express = require('express');
const execute = express.Router();
const jwt = require('jsonwebtoken');
const winston = require('../../../config/winston.js');
const _DB_sheetsNode = require('../../../db/models/index').sheets_node;
const {_res_success} = require('../../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
  forbbidenError
} = require('../../utils/reserrHandler.js');

function _handle_GET_nounsStatics_Belong(req, res){
  new Promise((resolve, reject)=>{
    const userId = req.extra.tokenUserId;

    const cornerId = req.reqNounId; //corner now focus on
    const reqSubType = req.query.subType? req.query.subType: ''; //'residence', 'hometown', or 'stay', but preventing null query
    //find all users register the corner by type
    let whereObj = {};
    whereObj[reqSubType] = cornerId;
    _DB_sheetsNode.findAndCountAll({
      where: whereObj
    }).then((results)=>{
      let sendingData = {
        temp: {},
        count: results.count
      };

      resolve(sendingData);

    }).catch((err)=>{
      reject(new internalError(err, 131));
    });
  }).then((sendingData)=>{
    _res_success(res, sendingData, "GET: /nouns/:id/statics, belong, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

module.exports = {
  _handle_GET_nounsStatics_Belong
};
