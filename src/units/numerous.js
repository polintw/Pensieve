const express = require('express');
const execute = express.Router();

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
const Op = Sequelize.Op;
const _DB_units = require('../../db/models/index').units;
const _DB_marks = require('../../db/models/index').marks;
const _DB_attribution = require('../../db/models/index').attribution;
const _DB_marksContent = require('../../db/models/index').marks_content;

function _handle_GET_unitsByList(req, res){
  const userId = req.extra.tokenUserId;

  new Promise((resolve, reject)=>{
    //in this api, units list was passed from client,
    //we choose directly by that list, but Remember! limit the amount
    let unitsList = req.query.unitsList; //list was composed of 'exposedId'

    _DB_units.findAll({
      where: {
        exposedId: unitsList
      },
      limit: 64 //set limit to prevent api abuse, currently the longer list would be passed from NodesFilter, 64 is actually not enough
    }).then((result)=>{
      let sendingData={
        unitsBasic: {},
        marksBasic: {},
        usersList: [],
        pathsList: [],
        nounsListMix: [],
        temp: {
          chart: {},
          unitpm: []
        }
      }

      result.forEach((row, index)=>{
        if(row.author_identity == "user") sendingData.usersList.push(row.id_author)
        else if(row.author_identity == "pathProject"){
          sendingData.pathsList.push(row.used_authorId);
        };
        sendingData.unitsBasic[row.exposedId] = {
          unitsId: row.exposedId,
          authorId: (row.author_identity == 'user') ? row.id_author: row.used_authorId,
          authorIdentity: row.author_identity,
          pic_layer0: row.url_pic_layer0,
          pic_layer1: row.url_pic_layer1,
          createdAt: row.createdAt,
          outboundLink: (!!row.outboundLink_main && (row.outboundLink_main.length > 0)) ? row.outboundLink_main : null,
          marksList: [],
          nounsList: []
        };
        // set coordinates(set saperately due to null in some units.)
        if(!!row.latitude_img) {
          sendingData.unitsBasic[row.exposedId]["coordinates"] = {
            latitude: row.latitude_img,
            longitude: row.longitude_img
          };
        };
        //Now it's Important! We have to build a 'map' between unitid & exposedId
        sendingData.temp['chart'][row.id] = row.exposedId;
        sendingData.temp.unitpm.push(row.id); //push the internal id to form a list
      });

      return sendingData;
    }).then((sendingData)=>{
      let conditionsMarks = {
        where: {id_unit: sendingData.temp.unitpm}, //select from table by internal unit id
        attributes: ['id','id_unit','layer']
      },
      conditionAttri = {
        where: {id_unit: sendingData.temp.unitpm},
        attributes: ['id_unit', 'id_noun'],
      };
      let marksSelection = Promise.resolve(_DB_marks.findAll(conditionsMarks).catch((err)=>{throw err}));
      let attriSelection = Promise.resolve(_DB_attribution.findAll(conditionAttri).catch((err)=>{throw err}));

      return Promise.all([attriSelection, marksSelection])
      .then(([resultsAttri, resultsMarks])=>{
        /*
        Remember composed all unitsBasic related data by exposedId
        */
        resultsAttri.forEach((row, index)=> {
          let currentExposedId = sendingData.temp['chart'][row.id_unit];
          sendingData.unitsBasic[currentExposedId]["nounsList"].push(row.id_noun);
          //and push it into nounsListMix, but remember to avoid duplicate
          if(sendingData.nounsListMix.indexOf(row.id_noun)< 0) sendingData.nounsListMix.push(row.id_noun);
        });

        resultsMarks.forEach((row, index)=> {
          let currentExposedId = sendingData.temp['chart'][row.id_unit];
          sendingData.unitsBasic[currentExposedId]["marksList"].push(row.id);
          sendingData.marksBasic[row.id] = {
            layer: row.layer
          }
        });
        return sendingData;
      });
    }).then((sendingData) => {
      //compose editorContent for each mark in this section.
      return _DB_marksContent.findAll({
        where: {
          id_unit: sendingData.temp.unitpm
          }
      })
      .then((resultsMarksContent)=>{
        resultsMarksContent.forEach((row, index)=>{
          //editorContent was in form: {blocks:[], entityMap:{}}
          sendingData.marksBasic[row.id_mark]['editorContent'] = {
            blocks: [],
            entityMap: JSON.parse(row.contentEntityMap)
          };
          /*
          and Notive, every col here still remain in 'string', so parse them.
          */
          let blockLigntening=JSON.parse(row.contentBlocks_Light),
              textByBlocks=JSON.parse(row.text_byBlocks),
              inlineStyleRangesByBlocks=JSON.parse(row.inlineStyleRanges_byBlocks),
              entityRangesByBlocks=JSON.parse(row.entityRanges_byBlocks),
              dataByBlocks=JSON.parse(row.data_byBlocks);

          blockLigntening.forEach((blockBasic, index) => {
            blockBasic['text'] = textByBlocks[blockBasic.key]
            blockBasic['inlineStyleRanges'] = inlineStyleRangesByBlocks[blockBasic.key]
            blockBasic['entityRanges'] = entityRangesByBlocks[blockBasic.key]
            blockBasic['data'] = dataByBlocks[blockBasic.key]

            sendingData.marksBasic[row.id_mark]['editorContent'].blocks.push(blockBasic);
          });
        });

        resolve(sendingData);
      })
      .catch((err)=>{throw err})

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
  if (process.env.NODE_ENV == 'development') winston.verbose('GET: units /numerous.');
  _handle_GET_unitsByList(req, res);
})

module.exports = execute;
