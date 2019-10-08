const express = require('express');
const execute = express.Router();
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../config/jwt.js');
const winston = require('../../config/winston.js');
const _DB_marks = require('../../db/models/index').marks;
const _DB_inspired = require('../../db/models/index').inspired;
const _DB_attribution = require('../../db/models/index').attribution;
const _DB_notifications = require('../../db/models/index').notifications;
const _DB_notifiInspired = require('../../db/models/index').notifi_inspired;
const _DB_users_prefer_nodes = require('../../db/models/index').users_prefer_nodes;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  forbbidenError,
  internalError,
  authorizedError,
  notFoundError
} = require('../utils/reserrHandler.js');

function _handle_inspire_plain_DELETE(req, res){
  new Promise((resolve, reject)=>{
    const reqToken = req.body.token || req.headers['token'] || req.query.token;
    const jwtVerified = jwt.verify(reqToken, verify_key);
    if (!jwtVerified) throw new internalError(jwtVerified, 131)

    const userId = jwtVerified.user_Id;
    const markId = parseInt(req.query.markId);

    _DB_inspired.destroy({
      where: {id_mark: markId, id_user: userId}
    }).then(function(createdInspire) {
      resolve()
    })
  }).then(()=>{
    let sendingData ={
      temp:{}
    }
    _res_success(res, sendingData, "DELETE: inspire/ , complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

function _handle_inspire_plain_POST(req, res){
  new Promise((resolve, reject)=>{
    const reqToken = req.body.token || req.headers['token'] || req.query.token;
    const jwtVerified = jwt.verify(reqToken, verify_key);
    if (!jwtVerified) throw new internalError(jwtVerified, 131)

    let userId = jwtVerified.user_Id;
    const markId = parseInt(req.query.markId);

    _DB_marks.findByPk(markId).then((mark)=>{
      if(mark.id_author == userId) throw new forbbidenError("Fail attempt.",36);
      return _DB_inspired.create({ //create records in inspired table
        id_mark: markId,
        id_user: userId
      })
      .then(function(createdInspire) { //inform there is a new notification
        return _DB_notifications.create({
          id_user:userId,
          id_unit: mark.id_unit,
          id_reciever:mark.id_author,
          type:10, //stand for 'inspired to author'
          status: 'untouched'
        })
      })
      .then(()=>{
        return _DB_notifiInspired.create({ //save notification info by type
          id_unit: mark.id_unit,
          id_mark: markId,
          status: 'untouched'
        })
      })
      .then(()=>{
        resolve({markId: markId, userId: userId}); //data for internal proces after res
      })
    }).catch((error)=>{
      reject(error);
    })
  }).then((data)=>{
    let sendingData ={
      temp:{}
    }
    _res_success(res, sendingData, "POST: inspire/ , complete.");
    return data;
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  }).then((data)=>{
    //start processing the internal process which are not related to res

    //process for recording nodes preference
    async function dbSelectUpdate_Preference(nodesbyUnit){
      //select current records about nodes preference in DB
      await _DB_users_prefer_nodes.findOne({
        where:{id_user: data.userId}
      }).then((preference)=>{
        let prevList = JSON.parse(preference.list_inspired);
        let concatList = prevList.concat(nodesbyUnit);
        //concatList should be a new est. array now, no connection to the original preference
        const mergeList = concatList.filter((node, index)=>{
          //use the property of indexOf: only return the index of first one
          //to let every node iterate only once
          return concatList.indexOf(node) == index;
        });
        //then insert the new records back to table
        return _DB_users_prefer_nodes.update(
          {list_inspired: JSON.stringify(mergeList)},  //Important! and remember turn the array into string before update
          {where: {id_user: data.userId}}
        );
      })
    };
    //start from here! from selecting mark the inspired belong
    return _DB_marks.findOne({
      where: {id: data.markId}
    })
    .then((markResult)=>{
      return _DB_attribution.findAll({ //get nodes list by unit id
        where: {id_unit: markResult.id_unit}
      })
    })
    .then((attriResults)=>{
      let unitNodes = attriResults.map((attriRow, index)=>{
        return attriRow.id_noun;
      })
      return unitNodes;
    })
    .then((nodesbyUnit)=>{
      return dbSelectUpdate_Preference(nodesbyUnit);
    });

  }).catch((error)=>{
    //currently, only reachStatus are needed
    winston.error(`${"Internal process "} , ${"for "+"_handle_inspire_plain_POST"}, ${error}`);
  });
}

execute.post('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('POST: inspire/ ');
  _handle_inspire_plain_POST(req, res);
})

execute.delete('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('DELETE: inspire/ ');
  _handle_inspire_plain_DELETE(req, res);
})

module.exports = execute;
