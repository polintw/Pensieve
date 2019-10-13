const express = require('express');
const execute = express.Router();
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../config/jwt.js');
const winston = require('../../config/winston.js');
const _DB_inspired = require('../../db/models/index').inspired;
const _DB_marks = require('../../db/models/index').marks;
const _DB_units = require('../../db/models/index').units;
const _DB_attribution = require('../../db/models/index').attribution;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
} = require('../utils/reserrHandler.js');

function _handle_GET_accumulated_Inspire(req, res){
  new Promise((resolve, reject)=>{
    const reqToken = req.body.token || req.headers['token'] || req.query.token;
    const jwtVerified = jwt.verify(reqToken, verify_key);
    if (!jwtVerified) throw new internalError(jwtVerified, 32);

    let userId = jwtVerified.user_Id;
    //select all inspired records of this user
    return _DB_inspired
      .findAndCountAll({
        where: {
          id_user: userId
        }
      })
      .then(function(inspiredResults) {
        let marksList = inspiredResults ? inspiredResults.rows.map((row, index)=>{
          return row.id_mark;
        }):[]; //in case there is not any inspired records
        resolve(marksList);
      }).catch((err)=>{
        throw new internalError(err, 131);
      });
  }).then((marksList)=>{
    //then use the inspired id to select the compromise marks
    return _DB_marks
      .findAll({
        where: {
          id: marksList
        },
        attributes: ['id','id_unit','id_author','editor_content','layer']
      })
      .then((marksResults)=>{
        let sendingData={
          marksList: marksList,
          unitsList: [],
          usersList: [],
          nounsListMix: [],
          unitsBasic: {},
          marksBasic: {},
          temp: {}
        };
        if(marksResults) marksResults.forEach((row, index)=>{
          //in case there is not any inspired records
          //deal with unitsList, marksBasic, & part of unitsBasic before we get detailed units info
          if(!sendingData.unitsList.includes(row.id_unit))sendingData.unitsList.unshift(row.id_unit);
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
        //and pass sendingData to the next Promise then
        return sendingData;
      })
      .catch((err)=>{
        throw new internalError(err, 131);
      });
  }).then((sendingData)=>{
    //pass select if there is not any records
    if(sendingData.unitsList.length< 1) return sendingData
    else {
      return _DB_units
        .findAll({
          where: {
            id: sendingData.unitsList
          },
          attributes: ['id', 'id_author', 'url_pic_layer0','url_pic_layer1','createdAt']
        })
        .then((unitsResults)=>{
          unitsResults.forEach((row, index)=>{
            sendingData.usersList.push(row.id_author);
            Object.assign(sendingData.unitsBasic[row.id], {
              pic_layer0: row.url_pic_layer0,
              pic_layer1: row.url_pic_layer1,
              createdAt: row.createdAt
            });
          })
          //similar, pass the sendingData
          return sendingData;
        })
        .catch((err)=>{
          throw new internalError(err, 131);
        });
    }
  }).then((sendingData)=>{
    //pass select if there is not any records
    if(sendingData.unitsList.length< 1) return sendingData
    else {
      return _DB_attribution
        .findAll({
          where:{
            id_unit: sendingData.unitsList
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
    }
  }).then((sendingData)=>{
    _res_success(res, sendingData, "GET: /inspire/accumulated, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /inspire/accumulated ');
  _handle_GET_accumulated_Inspire(req, res);
})

module.exports = execute;
