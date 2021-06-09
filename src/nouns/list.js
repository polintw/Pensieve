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
            {[Op.lt]: lastUnitTime }, {[Op.gt]: "2021-03-27" }
          ]
        },
        used_authorId: { [Op.notIn]: [15, 4] }
      },
      attributes: [
        //'max' here combined with 'group' prop beneath,
        //because the GROUP by would fail when the 'createdAt' is different between each row,
        //so we ask only the 'max' one by this method
        [Sequelize.fn('max', Sequelize.col('attribution.createdAt')), 'attribution.createdAt'], //fn(function, col, alias)
        //set attributes, so we also need to call every col we need
        'id_noun',
        'createdAt'
      ],
      group: 'id_noun', //Important. means we combined the rows by node, each id_noun would only has one row
      order: [ //make sure the order of arr are from latest
        Sequelize.literal('`attribution.createdAt` DESC')
      ],
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

    if (nodesByAttri.length < reqListLimit) sendingData.scrolled = false;
    // slice unwanted number after scrolled checked
    nodesByAttri.splice(reqListLimit);
    if(!!req.query.seperate){
      let listType = ["locationsList", "topicsList"];
      sendingData[listType[0]] = [];
      sendingData[listType[1]] = [];
      nodesByAttri.forEach((row, index) => {
        let listKey = (row.noun.category == "location_admin") ? listType[0] : listType[1];
        sendingData[listKey].push(row.id_noun);
        if(index == (nodesByAttri.length-1) ){
          sendingData['fetchBasedTime'] = row.createdAt;
        };
      });
    }
    else {
      let nodesList = nodesByAttri.map((row, index)=>{
        return row.id_noun;
      })
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
