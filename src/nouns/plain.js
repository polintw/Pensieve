const express = require('express');
const execute = express.Router();
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../config/jwt.js');
const winston = require('../../config/winston.js');
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  forbbidenError,
  internalError,
  authorizedError,
  notFoundError
} = require('../utils/reserrHandler.js');
const Sequelize = require('sequelize');
const _DB_units = require('../../db/models/index').units;
const _DB_marks = require('../../db/models/index').marks;
const _DB_attribution = require('../../db/models/index').attribution;

function _handle_GET_nouns_singular(req, res){
  new Promise((resolve, reject)=>{
    const reqToken = req.body.token || req.headers['token'] || req.query.token;
    const jwtVerified = jwt.verify(reqToken, verify_key);
    if (!jwtVerified) throw new authorizedError("during GET--nouns/singular, "+jwtVerified, 32);

    let userId = jwtVerified.user_Id;

    return _DB_attribution.findAll({
      where: {
        id_noun: req.reqNounId
      },
      attributes: ['id_unit'],
      order: [['createdAt', 'DESC']] //make sure the order of arr are from latest
    }).then((result)=>{
      let sendingData={
        unitsList: [],
        unitsBasic: {},
        marksBasic: {},
        usersList: [],
        nounsListMix: [],
        temp: {}
      }
      result.forEach((row, index)=>{
        sendingData.unitsList.push(row.id_unit);//let the latest created first render
      });

      return sendingData;
    }).then((sendingData)=>{
      return _DB_units.findAll({
        where: {id: sendingData.unitsList}
      }).then((result)=>{
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
        });

        return sendingData;
      }).catch((err)=>{
        throw err;
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
      })
    })
  }).then((sendingData)=>{
    _res_success(res, sendingData, "GET: /nouns/id="+req.reqNounId+", complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
};


execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /nouns/id='+req.reqNounId);
  _handle_GET_nouns_singular(req, res);
})

module.exports = execute;
