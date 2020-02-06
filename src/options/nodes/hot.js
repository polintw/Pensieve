const express = require('express');
const execute = express.Router();
const winston = require('../../config/winston.js');
const _DB_sheetsNode = require('../../db/models/index').sheets_node;

const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
} = require('../utils/reserrHandler.js');

function _handle_GET_options_Hot(req, res){
  new Promise((resolve, reject)=>{
    let userId = req.extra.tokenUserId; //use userId passed from pass.js

    //to exclude corers already favored by user,
    //we first select from sheets_node, rm them in the next selection from sheets
    _DB_sheetsNode.findOne({
      where: {id_user: userId}
    }).then((sheetsNodes)=>{
      let checkItems = ['residence', 'hometown', 'stay']; //cols name
      let currentRecords = checkItems.map((col, index)=>{
        return sheetsNodes[col];
      });

      return currentRecords; //arr contain belong nodes in id
    }).then((recordsList)=>{
      let sendingData={
        nodesList:[],
        temp: {}
      };


      resolve(sendingData);

    }).catch((err)=>{
      reject(new internalError(err, 131));
    });

  }).then((sendingData)=>{
    _res_success(res, sendingData, "options, GET: /nodes/hot, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

module.exports = _handle_GET_options_Hot;
