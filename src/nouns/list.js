const express = require('express');
const execute = express.Router();
const winston = require('../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_nouns = require('../../db/models/index').nouns;
const _DB_attri = require('../../db/models/index').attribution;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  notFoundError
} = require('../utils/reserrHandler.js');

async function _handle_GET_nouns_Assigned(req, res){
  const userId = req.extra.tokenUserId; //use userId passed from pass.js
  try{
    let unitBase = new Date(req.query.listUnitBase);
    const lastUnitTime = !isNaN(unitBase) ? unitBase : new Date(); // basically, undefined listUnitBase means first landing to the page
    const reqListLimit = 42;

    let nodesByAttri = await _DB_attri.findAll({
      where: {
        createdAt: {
          [Op.and]:[
            { [Op.lt]: lastUnitTime }, { [Op.gt]: "2021-01-02" }
          ]
        },
        used_authorId: {
          [Op.or]: [{[Op.notIn]: [15]}, null]
        }
      },
      attributes: [
        //'max' here combined with 'group' prop beneath,
        //because the GROUP by would fail when the 'createdAt' is different between each row,
        //so we ask only the 'max' one by this method
        [Sequelize.fn('max', Sequelize.col('attribution.createdAt')), 'createdAt'], //fn(function, col, alias)
        //set attributes, so we also need to call every col we need
        'id_noun'
      ],
      group: 'id_noun', //Important. means we combined the rows by node, each id_noun would only has one row
      order: ['id_noun'],
      include: {
        model: _DB_nouns,
        // INNER JOIN, no 'required' set
      },
      limit: 1280
    });

    let sendingData={
      scrolled: true, // true if theere is any qualified Unit not yet res
      fetchBasedTime: lastUnitTime.getTime(),
      temp: {}
    };

    if(!!req.query.seperate){
      let listType = ["locationsList", "topicsList"];
      sendingData[listType[0]] = [];
      sendingData[listType[1]] = [];
      let loopLength = 0,
          tooLongList = [],
          timeBase = new Date();
      while (
        loopLength < nodesByAttri.length &&
        (sendingData['locationsList'].length < reqListLimit || sendingData['topicsList'].length < reqListLimit)
      ) {
        let row = nodesByAttri[loopLength];
        let listKey = (row.noun.category == "location_admin") ? listType[0] : listType[1];
        if(sendingData[listKey].length >= reqListLimit){
          tooLongList.push(row.id_noun);
        } else{
          sendingData[listKey].push(row.id_noun);
          let rowDate = row.createdAt;
          if(rowDate.getTime() < timeBase.getTime()) timeBase = row.createdAt;
        };
        loopLength += 1;
      };
      // set timeBase
      sendingData['fetchBasedTime'] = timeBase;
      // and check if any item not used(spare for next fetch)
      if (tooLongList.length < 1) sendingData.scrolled = false;
    }
    else {
      if (nodesByAttri.length < reqListLimit) sendingData.scrolled = false;
      // slice unwanted number after scrolled checked
      nodesByAttri.splice(reqListLimit);
      let nodesList = nodesByAttri.map((row, index)=>{
        return row.id_noun;
      });
      sendingData['nodesList'] = nodesList;
    };

    _res_success(res, sendingData, "GET: /nouns/list, /assigned, complete.");
  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return;
  }
}

execute.get('/assigned', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /nouns/list, /assigned.');
  _handle_GET_nouns_Assigned(req, res);
})

module.exports = execute;
