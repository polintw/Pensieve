const express = require('express');
const execute = express.Router();
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../config/jwt.js');
const winston = require('../../config/winston.js');
const {_res_success} = require('../utils/resHandler.js');
const {
  _select_Basic
} = require('../utils/dbSelectHandler.js');
const {
  _handler_err_NotFound,
  _handler_err_BadReq,
  _handler_err_Unauthorized,
  _handler_err_Internal
} = require('../utils/reserrHandler.js');


function _handle_cosmicCompound_GET(req, res){
  new Promise((resolve, reject)=>{
    const reqToken = req.body.token || req.headers['token'] || req.query.token;
    const jwtVerified = jwt.verify(reqToken, verify_key);
    if (!jwtVerified) throw {err: jwtVerified, status: 401}

    let userId = jwtVerified.user_Id;
    let ordinal = req.query.ordinal; // prepare for one day, the algorithm need to know which time is it now
    let mysqlForm = {
      accordancesList: userId, //operator is not "IN"
      unitsList: []
    },
    selectCondition = {
      table: "units",
      cols: ["*"],
      where: []
    };
    //first, selecting by accordancelist

    return _select_Basic(selectCondition, mysqlForm.accordancesList).then((resultsUnit)=>{
      let sendingData={
        unitsList: [],
        unitsBasic: {},
        marksBasic: {},
        usersList: [],
        nounsListMix: [],
        temp: {}
      }
      if(resultsUnit.length < 1){return sendingData}; // if there is not any shareds record at all
      //if needed, selecting again by the result
      resultsUnit.forEach((row, index)=>{
        mysqlForm.unitsList.push([row.id]);
        sendingData.unitsList.push(row.id);
        sendingData.usersList.push(row.id_author);
        sendingData.unitsBasic[row.id] = {
          unitsId: row.id,
          authorId: row.id_author,
          pic_layer0: row.url_pic_layer0,
          pic_layer1: row.url_pic_layer1? row.url_pic_layer1:false,
          createdAt: row.createdAt,
          marksList: [],
          nounsList: []
        };
      });

      return sendingData;
    }).then((sendingData)=>{
      if(sendingData.unitsList.length < 1){return sendingData}; // as above, if there is not any shareds record at all
      let conditionsMarks = {
        table: 'marks',
        cols: ['id','id_unit','layer','editor_content'],
        where: ['id_unit']
      },
      conditionAttri = {
        table: 'attribution',
        cols: ['id_unit', 'id_noun'],
        where: ['id_unit']
      };
      let pMarks = Promise.resolve(_select_Basic(conditionsMarks, mysqlForm.unitsList).catch((errObj)=>{throw errObj}));
      let pAtrri = Promise.resolve(_select_Basic(conditionAttri, mysqlForm.unitsList).catch((errObj)=>{throw errObj}));

      return Promise.all([pAtrri, pMarks]).then((resultsStep2)=>{
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
    _res_success(res, sendingData, "Complete, GET: cosmic/compound.");
  }).catch((errObj)=>{
    winston.error(`${"Error: during GET: cosmic/compound, "} - ${errObj.err} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    switch (errObj.status) {
      case 400:
        _handler_err_BadReq(errObj.err, res);
        break;
      case 401:
        _handler_err_Unauthorized(errObj.err, res);
        break;
      case 404:
        _handler_err_NotFound(errObj.err, res);
        break;
      case 500:
        _handler_err_Internal(errObj.err, res);
        break;
      default:
        _handler_err_Internal(errObj.err?errObj.err:errObj, res);
    }
  });
};


execute.get('/', function(req, res){
  winston.info(`${"GET: cosmic/compound"} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  _handle_cosmicCompound_GET(req, res);
})

module.exports = execute;
