const express = require('express');
const execute = express.Router();
const jwt = require('jsonwebtoken');
const {_res_success} = require('../utils/resHandler.js');
const {verify_key} = require('../../config/jwt.js');
const winston = require('../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_units = require('../../db/models/index').units;
const _DB_marks = require('../../db/models/index').marks;
const _DB_attribution = require('../../db/models/index').attribution;
const _DB_usersCustomIndex = require('../../db/models/index').users_custom_index;
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
    let userId = req.extra.tokenUserId; //use userId passed from pass.js

    //first, selecting units depend on time order
    let reqTurn = req.query.turn; //get params passed

    const cycleFeedNr = 8; //the number of Units sent to the client during the adding round

    _DB_usersCustomIndex.findOne({ //get last visited time of user
      where: {
        id_user: userId
      },
      attributes: ['last_visit', 'id_user', 'last_feedGroup', 'createdAt']
    }).then((resultCustom)=>{
      /*
      for now, the main concept of algorithm is base on 'TIME': just list by time order.
      the only process is distinguishing the cycle the user has experienced,
      and whether the first round after load/reload :

      reqTurn ==1: <last_visit, limit 10, oreder by createdAt
      reqTurn > 1: <last_visit, limit 10+(last_feedGroup*8), order by createdAt, but only use last 8(oldest)

      *because the count(reqTurn) passed from client could not be trust, we just use it to check if first round

      */
      const selectLimit = (reqTurn> 1)? 10+(resultCustom.last_feedGroup*cycleFeedNr): 10;
      //the 1st round was 10, the last_feedGroup would start from 0,
      //and we are not sure what it is of last_feedGroup at firt round(basically would not be '0')

      return _DB_units.findAll({
        where: {
          createdAt: {[Op.lt]: resultCustom.last_visit}
        },
        limit: selectLimit,
        order: [['createdAt', 'DESC']] //make sure the order of arr are from latest
      }).then((resultsUnits)=>{
        let sendingData={
          unitsList: [],
          unitsBasic: {},
          marksBasic: {},
          usersList: [],
          nounsListMix: [],
          temp: {}
        }
        // if there is not any shareds record at all, or has alreadt to the very bottom of the DB,
        //just return nothing.
        if(resultsUnits.length < 1 || resultsUnits.length < (selectLimit-cycleFeedNr)){ resolve(sendingData); return;}
        //it is tricky But Improtant that the Promise should stop/jump out if above situtaion happened And,
        // the rest function should not be done to prevent possible confusing data!!
        //so we have to wrap it by a 'if else' method, And RETURN it inside the if.
        else
          if(reqTurn > 1){
            //then, use the number from the last, but remember preventing the situation reaching the bottom of the DB,
            //by compare the length of results and the length one round less of the selectLimit (selectLimit - cycleFeedNr)
            resultsUnits = resultsUnits.slice(
              (-1)*((resultsUnits.length < selectLimit)? (resultsUnits.length- (selectLimit-cycleFeedNr)):cycleFeedNr)
            );
          }

          resultsUnits.forEach((row, index)=>{
            sendingData.unitsList.push(row.id); //the order of resultsUnits has ordered by time, push() would follow the order
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
          })

          return sendingData;  //end of 'else' from if since sendingData announce

      }).then((sendingData)=>{
        //st this position, update the last_feedGroup in users_custom_index
        //due to the need of the  resultCustom, & the concern of after the finding Units
        return resultCustom.update(
          { last_feedGroup: (reqTurn> 1)? resultCustom.last_feedGroup+1 : 1},
          {
            where: {id_user  : userId},
            field: ['last_feedGroup']
          }
        ).then(()=>{
          return sendingData; //return without any edit
        });

      }).catch((err)=>{
        reject(new internalError(err, 131));
      });
    }).then((sendingData)=>{
      let conditionsMarks = {
            where: {id_unit: sendingData.unitsList},
            attributes: ['id','id_unit','layer','editor_content']
          },
          conditionAttri = {
            where: {
              id_unit: sendingData.unitsList
            }, //Notice, due to 'paranoid' prop set in Sequelize Model,
            //this selection would exclude all attribution have been 'deleted' (not null in 'deletedAt')
            attributes: ['id_unit', 'id_noun']
          };

      let pMarks = Promise.resolve(_DB_marks.findAll(conditionsMarks).catch((err)=>{throw err})),
          pAtrri = Promise.resolve(_DB_attribution.findAll(conditionAttri).catch((errObj)=>{throw errObj}));

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

        //final, pass to the highesst Promise by highest 'resolve'
        resolve(sendingData);
      }).catch((err)=>{
        reject(new internalError(err, 131));
      });
    }).catch((err)=>{
      reject(new internalError(err, 131));
    });
  }).then((sendingData)=>{
    _res_success(res, sendingData, "Complete, GET: feed/focus.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
};


execute.get('/', function(req, res){
  winston.verbose(`${"GET: feed/focus"} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  _handle_cosmicPresent_GET(req, res);
})

module.exports = execute;
