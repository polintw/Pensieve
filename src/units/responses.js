const express = require('express');
const execute = express.Router();
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../config/jwt.js');
const {_res_success} = require('../utils/resHandler.js');
const {
  _select_Units_withPromise,
  _select_UnitsList_withPromise,
  _select_Users_Author_withPromise,
  _select_Marks_withPromise
} = require('../utils/dbSelectHandler.js');
const {
  _handler_err_NotFound,
  _handler_err_BadReq,
  _handler_err_Unauthorized,
  _handler_err_Internal
} = require('../utils/reserrHandler.js');

function _handle_units_responses_GET(req, res){
  jwt.verify(req.headers['token'], verify_key, function(err, payload) {
    if (err) {
      _handler_err_Unauthorized(err, res)
    } else {
      console.log('data req: unit responses.');
      let userId = payload.user_Id;
      let mysqlForm = {
        accordancesList: [[req.reqUnitId]]
      };

      //first, selecting by accordancelist
      _select_Units_withPromise(mysqlForm.accordancesList, "id_primer").then((results)=>{
        let sendingData={
          unitsList: [],
          unitsBasic: {},
          marksBasic: {},
          authorsBasic: {},
          temp: {}
        }
        if(results.length < 1){return sendingData}; // if there is not any response record at all
        //if needed, selecting again by the result
        mysqlForm["unitsList"] = [];
        mysqlForm["authorsList"] = [];
        results.forEach((row, index)=>{
          mysqlForm.unitsList.push([row.id])
          mysqlForm.authorsList.push([row.id_author]);
        });

        let pAuthors = Promise.resolve(_select_Users_Author_withPromise(mysqlForm.authorsList));
        let pMarks = Promise.resolve(_select_Marks_withPromise(mysqlForm.unitsList, 'id_unit'));

        return Promise.all([pAuthors, pMarks]).then((resultsStep2)=>{
          // then, compose the dataset all together
          let unitsRows = results.slice();
          let authorsRows = resultsStep2[0];
          let marksRows = resultsStep2[1];

          unitsRows.forEach((row, index)=>{
            sendingData.unitsList.push(row.id);
            sendingData.unitsBasic[row.id] = {
              unitsId: row.id,
              authorId: row.id_author,
              pic_layer0: row.url_pic_layer0,
              created: row.established,
              marksList: []
            }
          })
          marksRows.forEach((row, index)=> {
            sendingData.unitsBasic[row.id_unit]["marksList"].push(row.id);
            sendingData.marksBasic[row.id] = {
              editorContent: JSON.parse(row.editor_content),
              layer: row.layer
            }
          })
          authorsRows.forEach((row, index)=>{
            sendingData.authorsBasic[row.id] = {
              authorAccount: row.account,
              id: row.id
            }
          })

          return (sendingData); //return to the 'parent' promise of current one?
        })
      }).then((sendingData)=>{
        _res_success(res, sendingData, "data req: unit responses, complete.");
      }).catch((errObj)=>{
        console.log("error occured during getting unit responses promise: "+errObj.err)
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

execute.get('/', function(req, res){
  console.log('request: GET, units/responses');
  _handle_units_responses_GET(req, res);
})

module.exports = execute;
