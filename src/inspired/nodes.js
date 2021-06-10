const express = require('express');
const execute = express.Router();
const winston = require('../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_attri = require('../../db/models/index').attribution;
const _DB_nouns = require('../../db/models/index').nouns;
const _DB_inspireds = require('../../db/models/index').inspireds;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  notFoundError
} = require('../utils/reserrHandler.js');

async function _handle_GET_inspired_NodesAssigned(req, res){
  const userId = req.extra.tokenUserId; //use userId passed from pass.js

  try{
    let unitBase = new Date(req.query.basedTime);
    const lastUnitTime = !isNaN(unitBase) ? unitBase : new Date(); // basically, undefined listUnitBase means first landing to the page
    // select the 'inspired' records first
    let inspiredSelection = await _DB_inspireds.findAll({
      where: {
        id_user: userId,
        createdAt: { [Op.lt]: lastUnitTime },
      }
    });
    let inspiredUnits = inspiredSelection.map((row, index)=>{
      return row.id_unit;
    });

    // select latest unit to each node from table nouns
    let nodesByAttri = await _DB_attri.findAll({
      where: {
        id_unit: inspiredUnits,
      },
      attributes: [
        //'max' here combined with 'group' prop beneath,
        //because the GROUP by would fail when the 'createdAt' is different between each row,
        //so we ask only the 'max' one by this method
        [Sequelize.fn('max', Sequelize.col('attribution.createdAt')), 'attribution.createdAt'], //fn(function, col, alias)
        //set attributes, so we also need to call every col we need
        'id_noun',
      ],
      group: 'id_noun', //Important. means we combined the rows by node, each id_noun would only has one row
      order: ['id_noun'],
      include: {
        model: _DB_nouns,
        // INNER JOIN, no 'required' set
      }
    });

    let sendingData={
      nextFetchBasedTime: null,
      temp: {}
    };

    if(!!req.query.seperate){
      let listType = ["locationsList", "topicsList"];
      sendingData[listType[0]] = [];
      sendingData[listType[1]] = [];
      nodesByAttri.forEach((row, index) => {
        let listKey = (row.noun.category == "location_admin") ? listType[0] : listType[1];
        sendingData[listKey].push(row.id_noun);
      });
    }
    else {
      let nodesList = nodesByAttri.map((row, index)=>{
        return row.id_noun;
      })
      sendingData['nodesList'] = nodesList;
    };

    _res_success(res, sendingData, "GET: /inspired/nodes, /assigned , complete.");
  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return;
  }

}

execute.get('/assigned', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /inspired/nodes, /assigned ');
  _handle_GET_inspired_NodesAssigned(req, res);
})

module.exports = execute;
