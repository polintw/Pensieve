const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');
const _DB_usersPreferNodes = require('../../../db/models/index').users_prefer_nodes;
const {_res_success} = require('../../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
} = require('../../utils/reserrHandler.js');

function _handle_GET_uRecords_nodes(req, res){
  new Promise((resolve, reject)=>{
    let userId = req.extra.tokenUserId; //use userId passed from pass.js

    //for now,only 1 type: 'shared', so we don'y check

    _DB_usersPreferNodes.findOne({
      where: {id_user: userId}
    }).then((row)=>{
      let sendingData={
        nodesList:[],
        temp: {}
      };

      sendingData.nodesList = JSON.parse(row['list_shared']); //parse to array from string

      //then recognize if limit, if there is not(in query), set the limit as nodesList length
      let limit = !!req.query.limit? req.query.limit : sendingData.nodesList.length;
      if(sendingData.nodesList.length > limit){
        //here, in order to cut the list to length we want, we loop for cycle 'unwanted'
        for(let i=0; i < (sendingData.nodesList.length -limit); i++){
          let randomNr = Math.floor(Math.random()*sendingData.nodesList.length); //get 'floor' due to the index start from '0'
          sendingData.nodesList.splice(randomNr, 1);
        }
      }

      resolve(sendingData);
    }).catch((err)=>{
      reject(new internalError(err, 131));
    });

  }).then((sendingData)=>{
    _res_success(res, sendingData, "records under user, GET: /nodes, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}


execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('records under user, GET: /nodes ');
  _handle_GET_uRecords_nodes(req, res);
});

module.exports = execute;
