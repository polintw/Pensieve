const express = require('express');
const execute = express.Router();
const jwt = require('jsonwebtoken');
const winston = require('../../config/winston.js');
const {verify_key} = require('../../config/jwt.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_notifications = require('../../db/models/index').notifications;
const _DB_lastvisitShared = require('../../db/models/index').lastvisit_shared;
const {_res_success} = require('../utils/resHandler.js');
const {
  _select_Basic
} = require('../utils/dbSelectHandler.js');
const {
  _handle_ErrCatched,
  internalError,
} = require('../utils/reserrHandler.js');

function _handle_GET_accumulated_Share(req, res){
  new Promise((resolve, reject)=>{
    const reqToken = req.body.token || req.headers['token'] || req.query.token;
    const jwtVerified = jwt.verify(reqToken, verify_key);
    if (!jwtVerified) throw new internalError(jwtVerified, 32);

    let sendingData={
      notifiedList: [],
      notifiedStatus: {},
      unitsList: [],
      unitsBasic: {},
      marksBasic: {},
      nounsListMix: [],
      temp: {userId: jwtVerified.user_Id}
    };

    //check if any notifications first

    return _DB_lastvisitShared.findOne({
      where:{id_user: sendingData.temp.userId},
      attributes: ['updatedAt']
    }).then((lastVisit)=>{
      return _DB_notifications.findAndCountAll({
        where: {
          id_reciever: sendingData.temp.userId,
          type: [10], //only choose type relate to Shared
          status: "untouched",
          createdAt: {[Op.gt]: lastVisit.updatedAt}
        },
        attributes: ['id','id_user', 'id_unit', 'type', 'status']
      })
    }).then((notifications)=>{
      //set notifications Unit into sendingData
      notifications.rows.forEach((row, index)=>{
        sendingData.notifiedList.unshift(row.id_unit);
        (row.id_unit in sendingData.notifiedStatus) ? (
          sendingData.notifiedStatus[row.id_unit]['inspired']=true
        ):(sendingData.notifiedStatus[row.id_unit]={inspired: true});
      });
      // modify status to assure the notify box know the seen notifications
      return notificaions.update(
        {status: 'delivered'}
      )
    }).then(()=>{
      //and don't forget to update visit time by update ip---Sequelize will do the rest
      return _DB_lastvisitShared.update(
        {ip: req.ip},
        {where: {id_user: sendingData.temp.userId}}
      );
    }).then(()=>{
      resolve(sendingData);
    }).catch((err)=>{
      reject(new internalError(err, 131));
    });
  }).then((sendingData)=>{

    //then select all the records we have, remember to pick off notified one
    let mysqlForm = {
      accordancesList: [[sendingData.temp.userId]],
      unitsList: []
    },
    selectCondition = {
      table: "units",
      cols: ["*"],
      where: ["id_author"]
    };
    return _select_Basic(selectCondition, mysqlForm.accordancesList)
      .then((resultShareds)=>{
        if(resultShareds.length < 1){return sendingData}; // if there is not any shareds record at all

        resultShareds.forEach((row, index)=>{
          mysqlForm.unitsList.push([row.id]);
          sendingData.unitsBasic[row.id] = {
            unitsId: row.id,
            authorId: sendingData.temp.userId,
            pic_layer0: row.url_pic_layer0,
            pic_layer1: row.url_pic_layer1,
            createdAt: row.createdAt,
            marksList: [],
            nounsList: []
          };
          if(sendingData.notifiedList.indexOf(row.id) != (-1)) return //ignore any unit has included in notifiedList
          else{
            sendingData.unitsList.push(row.id);
            sendingData.notifiedStatus[row.id]={inspired: false};
          };
        });})
      .then(()=>{
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
        let pMarks = Promise.resolve(_select_Basic(conditionsMarks, mysqlForm.unitsList).catch((error)=>{throw error}));
        let pAtrri = Promise.resolve(_select_Basic(conditionAttri, mysqlForm.unitsList).catch((error)=>{throw error}));
        let pDBNotifiStatus = _DB_notifications
          .findAll({
            where: {
              id_unit:sendingData.unitsList,
              id_reciever: sendingData.temp.userId,
              type: [10], //only choose type relate to a single Unit
              status: 'untouched'
            },
            attributes: ['id_user','id_unit','type','status']
          })
          .catch((error)=>{throw error});

        return Promise.all([pAtrri, pMarks, pDBNotifiStatus]).then((resultsStep2)=>{
          let resultsAttri = resultsStep2[0],
          resultsMarks = resultsStep2[1],
          resultsNotifications = resultsStep2[2];

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
          //finally, check notified status even they are not in a notifiedList
          resultsNotifications.forEach((row, index)=>{
            sendingData.notifiedStatus[row.id_unit]['inspired']=true;
          })

          return (sendingData); //return to the 'parent' promise of current one
        })
      }).catch((error)=>{
        throw new internalError("throw by /share/accumulated, "+error ,131);//'throw' at this level, stop the process
      });
  }).then((sendingData)=>{
    _res_success(res, sendingData, "Complete, GET: user actions/shareds.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /share/accumulated ');
  _handle_GET_accumulated_Share(req, res);
})

module.exports = execute;
