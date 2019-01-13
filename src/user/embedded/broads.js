const express = require('express');
const execute = express.Router();
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../../config/jwt.js');
const {_res_success} = require('../../utils/resHandler.js');
const {
  _insert_withPromise_Basic
} = require('../../utils/dbInsertHandler.js');
const {
  _select_withPromise_Basic
} = require('../../utils/dbSelectHandler.js');
const {
  UNITS_GENERAL,
  USERS_GENERAL,
  MARKS_UNITS,
  BROADS_USERS_UNITS
} = require('../../utils/queryIndicators.js');
const {
  _handler_err_NotFound,
  _handler_err_BadReq,
  _handler_err_Unauthorized,
  _handler_err_Internal
} = require('../../utils/reserrHandler.js');

function _handle_user_embeddedBroads_GET(req, res){
  jwt.verify(req.headers['token'], verify_key, function(err, payload) {
    if (err) {
      _handler_err_Unauthorized(err, res)
    } else {
      console.log('data req: user embedded, broads.');
      let userId = payload.user_Id;
      let mysqlForm = {
        accordancesList: [[userId]],
        authorsList: [],
        unitsList: []
      };

      //first, selecting by accordancelist
      _select_withPromise_Basic(BROADS_USERS_UNITS, mysqlForm.accordancesList).then((resultsBroads)=>{
        let sendingData={
          unitsList: [],
          unitsBasic: {},
          marksBasic: {},
          authorsBasic: {},
          temp: {}
        }
        if(resultsBroads.length < 1){return sendingData}; // if there is not any tracks in the unit at all
        //if needed, selecting again by the result
        resultsBroads.forEach((row, index)=>{
          mysqlForm.unitsList.push([row.id_unit]);
          sendingData.unitsList.push(row.id_unit);
        });

        let pUnits = Promise.resolve(_select_withPromise_Basic(UNITS_GENERAL, mysqlForm.unitsList)),
            pMarks = Promise.resolve(_select_withPromise_Basic(MARKS_UNITS, mysqlForm.unitsList));

        return Promise.all([pUnits, pMarks]).then((resultsDouble)=>{
          // then, last came, first processing
          let resultsUnits = resultsDouble[0];
          let resultsMarks = resultsDouble[1];

          resultsUnits.forEach((row, index)=>{
            sendingData.unitsBasic[row.id] = {
              unitsId: row.id,
              authorId: row.id_author,
              pic_layer0: row.url_pic_layer0,
              created: row.established,
              marksList: []
            };
            mysqlForm.authorsList.push([row.id_author]);
          })
          resultsMarks.forEach((row, index)=> {
            sendingData.unitsBasic[row.id_unit]["marksList"].push(row.id);
            sendingData.marksBasic[row.id] = {
              editorContent: JSON.parse(row.editor_content),
              layer: row.layer
            }
          })
          return _select_withPromise_Basic(USERS_GENERAL, mysqlForm.authorsList).then((resultsAuthors)=>{
            resultsAuthors.forEach((row, index)=>{
              sendingData.authorsBasic[row.id] = {
                authorAccount: row.account,
                id: row.id
              }
            })

            return sendingData;
          })
        })
      }).then((sendingData)=>{
        _res_success(res, sendingData, "data req: user embedded, broads, complete.");
      }).catch((errObj)=>{
        console.log("error occured during getting user embedded, broads promise: "+errObj.err)
        if("status" in errObj){ //temporary method, due to there are still some function didn't have "status" argument.
          switch (errObj.status) {
            case 400:
              _handler_err_BadReq(errObj.err, res)
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

execute.get('/', function(req, res){
  console.log('request: GET, user/embedded, broads');
  _handle_user_embeddedBroads_GET(req, res);
})

module.exports = execute;
