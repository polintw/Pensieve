const express = require('express');
const execute = express.Router();

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

function _handle_GET_units(req, res){
  new Promise((resolve, reject)=>{
    let userId = req.extra.tokenUserId;

    //in this api, units list was passed from client,
    //we choose directly by that list, but Remember! limit the amount

    _DB_units.findAll({
      where: {

      }

    }).then((result)=>{

      let sendingData={
        unitsBasic: {},
        marksBasic: {},
        usersList: [],
        nounsListMix: [],
        temp: {}
      }

      result.forEach((row, index)=>{
        if(row.id == req.query.unitId) return; //exclude the origin Unit, it's better using DB ORM to do the job
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
    _res_success(res, sendingData, "GET units: plain, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
};

execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET units: plain');
  _handle_GET_units(req, res);
})

module.exports = execute;
