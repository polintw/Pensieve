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
  _handle_ErrCatched,
  forbbidenError,
  internalError,
  authorizedError,
  notFoundError
} = require('../utils/reserrHandler.js');


function _handle_cosmicPresent_GET(req, res){
  new Promise((resolve, reject)=>{
    const reqToken = req.body.token || req.headers['token'] || req.query.token;
    const jwtVerified = jwt.verify(reqToken, verify_key);
    if (!jwtVerified) throw new authorizedError("during GET--cosmic/present, "+jwtVerified, 32);

    let userId = jwtVerified.user_Id;
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
          pic_layer1: row.url_pic_layer1,
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
    _res_success(res, sendingData, "Complete, GET: cosmic/present.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
};


execute.get('/', function(req, res){
  winston.verbose(`${"GET: cosmic/present"} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  _handle_cosmicPresent_GET(req, res);
})

module.exports = execute;
