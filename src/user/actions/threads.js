const express = require('express');
const execute = express.Router();
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../../config/jwt.js');
const {_res_success} = require('../../utils/resHandler.js');
const {
  _select_Users_Author_withPromise,
  _select_Marks_withPromise,
  _select_Threads_withPromise,
  _select_withPromise_Basic
} = require('../../utils/dbSelectHandler.js');
const {
  _handler_err_NotFound,
  _handler_err_BadReq,
  _handler_err_Unauthorized,
  _handler_err_Internal
} = require('../../utils/reserrHandler.js');
const {
  DIALOGUES_LATEST
} = require('../../utils/queryIndicators.js');

function _handle_actions_threadsOfShared_GET(req, res){
  jwt.verify(req.headers['token'], verify_key, function(err, payload) {
    if (err) {
      _handler_err_Unauthorized(err, res)
    } else {
      let userId = payload.user_Id;
      let mysqlForm = {
        accordancesList: [[req.params.sharedId]],
        marksList: [],
        authorsList: [],
        threadsList: []
      };

      //first, selecting by accordancelist
      _select_Marks_withPromise(mysqlForm.accordancesList, "id_unit").then((resultsMarks)=>{
        let sendingData={
          marksSet: {},
          threadsBasic: {},
          threadsList: {},
          authorsBasic: {},
          temp: {}
        }
        if(resultsMarks.length < 1){return sendingData}; // if there is not any marks in the unit at all
        //if needed, selecting again by the result
        resultsMarks.forEach((row, index)=>{
          mysqlForm.marksList.push([row.id]);
        });

        return _select_Threads_withPromise(mysqlForm.marksList, "id_mark").then((resultsThreads)=>{
          if(resultsThreads.length < 1){return}; // if there is not any threads opened at all
          resultsThreads.forEach((row, index)=>{
            mysqlForm.authorsList.push([row.id_participant]);
            mysqlForm.threadsList.push([row.id]);
          });
          let pAuthors = Promise.resolve(_select_Users_Author_withPromise(mysqlForm.authorsList));
          let pDialogues = Promise.resolve(_select_withPromise_Basic(DIALOGUES_LATEST, mysqlForm.threadsList));

          return Promise.all([pAuthors, pDialogues]).then((resultsDouble)=>{
            // then, last came, first processing
            let authorsRows = resultsDouble[0];
            let dialoguesRows = resultsDouble[1];

            resultsThreads.forEach((row, index)=>{
              //deal with 'threadsBasic', first part
              sendingData.threadsBasic[row.id] = {
                participant: row.id_participant,
                mark: row.id_mark
              };
            })
            dialoguesRows.forEach((row, index) => {
              let markBelonged = sendingData.threadsBasic[row.id_thread].mark;
              markBelonged in sendingData.threadsList ? sendingData.threadsList[markBelonged].push(row.id_thread):sendingData.threadsList[markBelonged]=[row.id_thread];
              //deal with 'threadsBasic', second part
              Object.assign(sendingData.threadsBasic[row.id_thread], {
                editorContent: JSON.parse(row.editor_content),
                lastTalker: row.id_talker,
                lastTime: row.max_date
              })
            });
            authorsRows.forEach((row, index)=>{
              sendingData.authorsBasic[row.id] = {
                authorAccount: row.account,
                id: row.id
              }
            })

            return;
          })
        }).then(()=>{
          // finally, deal with the data we first get, marksSet
          resultsMarks.forEach((row, index)=> {
            sendingData.marksSet[row.id] = {
              id: row.id,
              editorContent: JSON.parse(row.editor_content),
              layer: row.layer,
              markCoordinate: {top: row.portion_top, left: row.portion_left},
              serial: row.serial
            }
          })
          return sendingData
        })
      }).then((sendingData)=>{
        _res_success(res, sendingData, "shared's threads req: complete.");
      }).catch((errObj)=>{
        console.log("error occured during getting shared's threads req promise: "+errObj.err)
        if("status" in errObj){ //temporary method, due to there are still some function didn't have "status" argument.
          switch (errObj.status) {
            case 404:
              _handler_err_NotFound(errObj.err, res);
              break;
            case 500:
              _handler_err_Internal(errObj.err, res);
              break;
            default:
              _handler_err_Internal(errObj.err, res);
          }
          return;
        }
        _handler_err_Internal(errObj.err, res);
      });
    }
  })
}

execute.get('/:sharedId', function(req, res){
  console.log('request: GET, actions/threads shared');
  _handle_actions_threadsOfShared_GET(req, res);
})

module.exports = execute;
