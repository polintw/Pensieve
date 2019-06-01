const express = require('express');
const execute = express.Router();
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../config/jwt.js');
const winston = require('../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_inspired = require('../../db/models/index').inspired;
const _DB_marks = require('../../db/models/index').marks;
const _DB_units = require('../../db/models/index').units;
const _DB_attribution = require('../../db/models/index').attribution;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
} = require('../utils/reserrHandler.js');

function _handle_GET_window_accumulated(req, res){
  new Promise((resolve, reject)=>{
    const reqToken = req.body.token || req.headers['token'] || req.query.token;
    const jwtVerified = jwt.verify(reqToken, verify_key);
    if (!jwtVerified) throw new internalError(jwtVerified, 32);

    let userId = (req.query.userId==jwtVerified.user_Id) ?jwtVerified.user_Id:req.query.userId;
    //select inspired and shared records of this user in the same time
    let conditionsInspired = {
      where: {id_user: userId},
      attributes: ['id_mark','createdAt'],
      order: [['createdAt', 'DESC']] //make sure the order of arr are from latest
    },
    conditionShared = {
      where: {id_author: userId},
      order: [['createdAt', 'DESC']] //make sure the order of arr are from latest
    };
    let inspiredSelection = Promise.resolve(_DB_inspired.findAll(conditionsInspired).catch((err)=>{throw err}));
    let sharedSelection = Promise.resolve(_DB_units.findAll(conditionShared).catch((err)=>{throw err}));

    return Promise.all([inspiredSelection, sharedSelection]).then((resultsSelect)=>{
      let resultsInspired = resultsSelect[0],
      resultsShared = resultsSelect[1];
      let sendingData={
        mixList: [],
        unitsBasic: {},
        marksBasic: {},
        usersList: [],
        nounsListMix: [],
        temp: {
          datetimeSet: {}, //use createdAt(modified) as key
          timeList: [], //createdAt(modified) prepared for sort()
          marksList: [], //markId save the inspired mark
          inspiredList: [], //unitsId save the inspired units
          unitsList: [] //all units related include shared and inspired
        }
      };

      resultsInspired.forEach((row, index)=>{
        //now we need to compare createdAt(datetime)
        //use createdAt as sort source
        let timeKey = row.createdAt.replace(/(-:\s)/g, "");
        sendingData.temp.datetimeSet[timeKey]={id: row.id_mark, type: "inspired"}; //record the real id for each 'createdAt'
        sendingData.temp.timeList.push(timeKey);
        sendingData.temp.marksList.push(row.id_mark);
        //and complete the usersList here
        sendingData.usersList.push(row.id_author);
      });

      resultsShared.forEach((row, index)=>{
        let timeKey = row.createdAt.replace(/(-:\s)/g, "");
        sendingData.temp.datetimeSet[timeKey]={id: row.id, type: "shared"}; //record the real id for each 'createdAt'
        sendingData.temp.timeList.push(timeKey);
        //keep id to a units list to select nouns and marks later
        sendingData.temp.unitsList.push(row.id);
        //and still save the Units data to the sendingData
        sendingData.unitsBasic[row.id] = {
          unitsId: row.id,
          authorId: row.id_author,
          pic_layer0: row.url_pic_layer0,
          pic_layer1: row.url_pic_layer1,
          createdAt: row.createdAt,
          marksList: [],
          nounsList: []
        };
      });// now resultsShared was useless

      sendingData.temp.timeList.sort();
      sendingData.temp.timeList.reverse(); //reverse becuase we need the lateset to be render first
      sendingData.temp.timeList.forEach((id, index)=>{
        sendingData.mixList.push(sendingData.temp.datetimeSet[id]);
      })
      //then finish the mixlist ordered by created time

      resolve(sendingData);
    }).catch((err)=>{
      throw new internalError(err, 131);
    });

  }).then((sendingData)=>{
    //then use the inspired id to select the compromise marks
    return _DB_marks
      .findAll({
        where: {
          [Op.or]:[{id: sendingData.temp.marksList}, {id_unit: sendingData.temp.unitsList}]
          //here, we select both the mark inspired, "and" the mark belong to the shareds
          //notice! the temp.unitsList now has only shared id,
          //but would plus inspired units later, so definately select marks from here
          //of course that's because we don't select other mark for inspired units later
        },
        attributes: ['id','id_unit','id_author','editor_content','layer']
      })
      .then((marksResults)=>{
        marksResults.forEach((row, index)=>{
          //deal with unitsList, marksBasic, & part of unitsBasic before we get detailed units info
          //check if there is already this unitId in list, to avoid select repeatedly
          if(!sendingData.temp.unitsList.includes(row.id_unit))sendingData.temp.unitsList.push(row.id_unit);
          //and for seperating from shared list, we save to a temp list for select units data later
          if(!sendingData.temp.inspiredList.includes(row.id_unit))sendingData.temp.inspiredList.push(row.id_unit);
          if(row.id_unit in sendingData.unitsBasic){
            sendingData.unitsBasic[row.id_unit].marksList.push(row.id);
          }else{
            sendingData.unitsBasic[row.id_unit] = {
              unitsId: row.id_unit,
              authorId: row.id_author,
              pic_layer0: "",
              pic_layer1: "",
              createdAt: "",
              marksList: [row.id],
              nounsList: []
            }
          };
          sendingData.marksBasic[row.id] = {
            editorContent: JSON.parse(row.editor_content),
            layer: row.layer,
            unitId: row.id_unit
          }
        });
        //now we complete marksBasic totally

        return sendingData;
      })
      .catch((err)=>{
        throw new internalError(err, 131);
      });
  }).then((sendingData)=>{
    return _DB_units
      .findAll({
        where: {
          id: sendingData.temp.inspiredList
        },
        attributes: ['id', 'id_author', 'url_pic_layer0','url_pic_layer1','createdAt']
      })
      .then((unitsResults)=>{
        unitsResults.forEach((row, index)=>{
          Object.assign(sendingData.unitsBasic[row.id], {
            pic_layer0: row.url_pic_layer0,
            pic_layer1: row.url_pic_layer1,
            createdAt: row.createdAt
          });
        })

        return sendingData;
      })
      .catch((err)=>{
        throw new internalError(err, 131);
      });
  }).then((sendingData)=>{
    //we select from attribution and units(for inspired) seperately becuase,
    //they both modify the unitsBasic
    return _DB_attribution
      .findAll({
        where:{
          id_unit: sendingData.temp.unitsList
        },
        attributes: ['id_unit', 'id_noun']
      })
      .then((attriResults)=> {
        attriResults.forEach((row, index)=> {
          sendingData.unitsBasic[row.id_unit]["nounsList"].push(row.id_noun);
          sendingData.nounsListMix.push(row.id_noun);
        })

        return sendingData;
      })
      .catch((err)=>{
        throw new internalError(err, 131);
      });
  }).then((sendingData)=>{
    _res_success(res, sendingData, "GET: /window/accumulated, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /window/accumulated ');
  _handle_GET_window_accumulated(req, res);
})

module.exports = execute;
