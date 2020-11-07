const express = require('express');
const execute = express.Router();
const winston = require('../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_units = require('../../db/models/index').units;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
} = require('../utils/reserrHandler.js');

async function _handle_GET_shareds_nodesAccumulated(req, res){
  const userId = req.extra.tokenUserId; //use userId passed from pass.js
  const reqDepth = req.query.depth;
  const reqNodes = !!req.query.nodesList ? req.query.nodesList : []; // in case the list in params was empty or not exist

  try{
    // select latest unit to each node from table nouns
    let unitsByAttri = await _DB_attri.findAll({
      where: {
        id_noun: reqNodes,
        id_author: userId,
        author_identity: "user"
      },
      attributes: [
        //'max' here combined with 'group' prop beneath,
        //because the GROUP by would fail when the 'createdAt' is different between each row,
        //so we ask only the 'max' one by this method
        [Sequelize.fn('max', Sequelize.col('createdAt')), 'createdAt'], //fn(function, col, alias)
        //set attributes, so we also need to call every col we need
        'id_noun',
        'id_unit',
      ],
      group: 'id_noun' //Important. means we combined the rows by node, each id_noun would only has one row
    });
    let unitsId = unitsByAttri.map((row, index)=>{
      return row.id_unit;
    });

    let unitsInfo = await _DB_units.findAll({
        where: {
          id: unitsId
        }
      });
    let unitsExposedIdKey = {};
    unitsInfo.forEach((row, index) => {
      unitsExposedIdKey[row.id] = row.exposedId
    });

    let sendingData={
      nodesUnits: {},
      temp: {}
    };
    // make the list by exposedId from unitsInfo
    unitsByAttri.forEach((row, index) => {
      sendingData.nodesUnits[row.id_noun] = unitsExposedIdKey[row.id_unit];
    });


    _res_success(res, sendingData, "GET: /shareds/accumulated, /nodes, complete.");

  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return;
  }
}

function _handle_GET_accumulated_Share(req, res){
  const userId = req.extra.tokenUserId; //use userId passed from pass.js

  let sendingData={
    unitsList: [],
    temp: {}
  };

  _DB_units.findAll({
    where: {id_author: userId},
    limit: 32
  })
  .then((resultShareds)=>{
    if(resultShareds.length < 1){return sendingData}; // if there is not any shareds record at all

    resultShareds.forEach((row, index)=>{
      sendingData.unitsList.unshift(row.exposedId); //let the latest in the top at client view
    });

    return sendingData;
  }).then((sendingData)=>{
    _res_success(res, sendingData, "Complete, GET: user actions/shareds.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

execute.get('/nodes', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /shareds/accumulated, /nodes.');
  _handle_GET_shareds_nodesAccumulated(req, res);
})

execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /share/accumulated ');
  _handle_GET_accumulated_Share(req, res);
})

module.exports = execute;
