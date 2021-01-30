const express = require('express');
const execute = express.Router();
const winston = require('../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
} = require('../utils/reserrHandler.js');
const _DB_nouns = require('../../db/models/index').nouns;
const _DB_attri = require('../../db/models/index').attribution;
const _DB_nodesLocation = require('../../db/models/index').nodes_locationAdmin;

async function _handle_nouns_basicAccumulations_GET(req, res){
  const userId = req.extra.tokenUserId;
  const fetchList = req.query.fetchList;

  try{
    const nodesByAttri = await _DB_attri.findAll({
      where: {
        id_noun: fetchList,
      },
      attributes: [
        //'max' here combined with 'group' prop beneath,
        //because the GROUP by would fail when the 'createdAt' is different between each row,
        //so we ask only the 'max' one by this method
        [Sequelize.fn('max', Sequelize.col('createdAt')), 'createdAt'], //fn(function, col, alias)
        //set attributes, so we also need to call every col we need
        'id_noun',
      ],
      group: 'id_noun' //Important. means we combined the rows by node, each id_noun would only has one row
    });

    let sendingData={
      nounsBasicAccu:{},
      temp: {}
    };

    nodesByAttri.forEach((row, index) => {
      sendingData.nounsBasicAccu[row.id_noun] = {accumulationsify: true};
    });


    _res_success(res, sendingData, "GET: /nouns/basic/accumulations, complete.");
  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return;
  }

}

function _handle_nouns_basic_GET(req, res){
  new Promise((resolve, reject)=>{
    let userId = req.extra.tokenUserId;
    let fetchList = req.query.fetchList;

    _DB_nouns.findAll({
      where: {id: fetchList},
    })
    .then((results)=>{
      let sendingData={
        nounsBasic:{},
        temp: {
          nodesList: []
        }
      };

      results.forEach((row, index)=>{
        sendingData.nounsBasic[row.id] = {
          id: row.id,
          name: row.name,
          prefix: row.prefix,
          parentId: !!row.parent_id ? row.parent_id : null,
          parentify: (row.parent ? true : false),
          childify: (row.child ? true : false)
        };
        sendingData.temp.nodesList.push(row.id);
      })

      return sendingData;
    })
    .then((sendingData)=>{
      return _DB_nodesLocation.findAll({
        where: {
          id_node: sendingData.temp.nodesList
        }
      })
      .then((results)=>{
        results.forEach((row, index) => {
          sendingData.nounsBasic[row.id_node]['latitude'] = row.location_lat;
          sendingData.nounsBasic[row.id_node]['longitude'] = row.location_lon;
        });

        resolve(sendingData);
      });

    }).catch((err)=>{ //catch the error came from the whole
      reject(err);
    });
  }).then((sendingData)=>{
    _res_success(res, sendingData, "GET nouns: /basic, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

execute.get('/accumulations', function(req, res){
  if (process.env.NODE_ENV == 'development') winston.verbose('GET nouns: /basic/accumulations.');
  _handle_nouns_basicAccumulations_GET(req, res);
})

execute.get('/', function(req, res){
  if (process.env.NODE_ENV == 'development') winston.verbose('GET nouns: /basic.');
  _handle_nouns_basic_GET(req, res);
})

module.exports = execute;
