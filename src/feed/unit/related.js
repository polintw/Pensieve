const express = require('express');
const execute = express.Router();
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../../config/jwt.js');
const winston = require('../../../config/winston.js');
const {_res_success} = require('../../utils/resHandler.js');
const {
  _handle_ErrCatched,
  forbbidenError,
  internalError,
  authorizedError,
  notFoundError
} = require('../../utils/reserrHandler.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_units = require('../../../db/models/index').units;
const _DB_marks = require('../../../db/models/index').marks;
const _DB_attribution = require('../../../db/models/index').attribution;

function _handle_GET_feed_unitRelated(req, res){
  new Promise((resolve, reject)=>{
    const reqToken = req.body.token || req.headers['token'] || req.query.token;
    const jwtVerified = jwt.verify(reqToken, verify_key);
    if (!jwtVerified) throw new authorizedError("during GET--nouns/singular, "+jwtVerified, 32);

    let userId = jwtVerified.user_Id;
    //we need to select the related info about the origin Unit
    //and the Units shared the nodes the origin one has
    //we do at the same time use .all()

    //use 'join select',
    // But! perhaps this would be inappropriate after the attribution became too big
    let conditionsAttri = {
      include: [{
        model: _DB_attribution,
        required: true,
        as: 'pairNouns'
      }],
      where: {
        id_unit: req.query.unitId
      }
    };
    //would give us the 'id_unit' shared the nodes origin has from the attribution
    let attriSelection = Promise.resolve(_DB_attribution.findAll(conditionsAttri).catch((err)=>{throw err}));
    //would give us the whole info of the origin
    let originSelection = Promise.resolve(_DB_units.findByPk(req.query.unitId).catch((err)=>{throw err}));

    return Promise.all([attriSelection, originSelection])
    .then((resultsAll)=>{
      let originUnit = resultsAll[1],
          nodesRelated = resultsAll[0]; //due to we use the findAndCountAll()
      let sendingData={
        unitsList: [],
        unitsBasic: {},
        marksBasic: {},
        usersList: [],
        nounsListMix: [],
        temp: {}
      }
console.log(resultsAll[0].count)
      nodesRelated.forEach((rowOrigin,index)=>{
console.log(rowOrigin['pairNouns'].length)
        rowOrigin['pairNouns'].forEach((rowJoin, index)=>{
          if(!sendingData.unitsList.includes(rowJoin.id_unit)) sendingData.unitsList.push(rowJoin.id_unit);
        })
      });

      //now, we have the list of units shared the nodes as origin from attribution
      //and, we have the author id of origin unit as well
      return _DB_units.findAll({
        where: {
          [Op.or]: [{id: sendingData.unitsList},{id_author: originUnit.id_author}]
        }
      }).then((result)=>{
console.log(result.length)
        result.forEach((row, index)=>{
          sendingData.usersList.push(row.id_author);
          sendingData.unitsBasic[row.id] = {
            unitsId: row.id,
            authorId: row.id_author,
            pic_layer0: row.url_pic_layer0,
            pic_layer1: row.url_pic_layer1,
            createdAt: row.createdAt,
            marksList: [],
            nounsList: []
          };
          //because there are some Units select from author id,
          //did not on the list yet.
          if(!sendingData.unitsList.includes(row.id)) sendingData.unitsList.push(row.id);
        });
console.log(sendingData.unitsList)
        return sendingData;
      });
    }).then((sendingData)=>{
      let conditionsMarks = {
        where: {id_unit: sendingData.unitsList},
        attributes: ['id','id_unit','layer','editor_content']
      },
      conditionAttri = {
        where: {id_unit: sendingData.unitsList},
        attributes: ['id_unit', 'id_noun'],
      };
      let marksSelection = Promise.resolve(_DB_marks.findAll(conditionsMarks).catch((err)=>{throw err}));
      let attriSelection = Promise.resolve(_DB_attribution.findAll(conditionAttri).catch((err)=>{throw err}));

      return Promise.all([attriSelection, marksSelection]).then((resultsStep2)=>{
        let resultsAttri = resultsStep2[0],
        resultsMarks = resultsStep2[1];

        resultsAttri.forEach((row, index)=> {
          sendingData.unitsBasic[row.id_unit]["nounsList"].push(row.id_noun);
          sendingData.nounsListMix.push(row.id_noun);
        });

        resultsMarks.forEach((row, index)=> {
          sendingData.unitsBasic[row.id_unit]["marksList"].push(row.id);
          sendingData.marksBasic[row.id] = {
            editorContent: JSON.parse(row.editor_content),
            layer: row.layer
          }
        });
        sendingData.nounsListMix = sendingData.nounsListMix.filter((id, index, list)=>{
          return index == list.indexOf(id);
        }); //remove duplicate from the array
        resolve(sendingData);
      });
    }).catch((err)=>{ //catch the error came from the whole
      reject(err);
    });
  }).then((sendingData)=>{
    _res_success(res, sendingData, "GET: /nouns/id="+req.reqNounId+", complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
};


module.exports = _handle_GET_feed_unitRelated;
