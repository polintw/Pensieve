const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_sheetsNode = require('../../../db/models/index').sheets_node;
const _DB_lastUpdate_NodeBelongs = require('../../../db/models/index').lastUpdate_nodeBelongs;
const {_res_success} = require('../../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
} = require('../../utils/reserrHandler.js');

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
      /*
        select last update, perhaps last 20 (ref: broad).
        exclude nodes the user has before return to client
      */
      return _DB_lastUpdate_NodeBelongs.findAll({
        limit: 17, //17 latest records
        order: [ //make sure the order of arr are from latest
          Sequelize.literal('`updatedAt` DESC') //and here, using 'literal' is due to some wierd behavior of sequelize,
          //it would make an Error if we provide col name by 'arr'
        ]
      })
      .then((results)=>{
        let sendingData={
          nodesList:[],
          temp: {}
        };
        results.forEach((row, index)=>{
          if(recordsList.indexOf(row.id_node) < 0) sendingData.nodesList.push(row.id_node);
        });

        resolve(sendingData);

      })
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
