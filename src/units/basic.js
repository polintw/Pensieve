const express = require('express');
const execute = express.Router();
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../config/jwt.js');
const {_res_success} = require('../utils/resHandler.js');
const {
  _select_Units_withPromise,
  _select_nounsAttribution_unit_withPromise,
  _select_Users_Author_withPromise
} = require('../utils/dbSelectHandler.js');
const {
  _handler_err_NotFound,
  _handler_err_BadReq,
  _handler_err_Unauthorized,
  _handler_err_Internal
} = require('../utils/reserrHandler.js');

function _handle_units_basic_GET(req, res){
  jwt.verify(req.headers['token'], verify_key, function(err, payload) {
    if (err) {
      _handler_err_Unauthorized(err, res)
    } else {
      let userId = payload.user_Id;
      console.log('data req: unit basic.');
      let mysqlForm = {
        accordancesList: [[req.reqUnitId]]
      };

      _select_Units_withPromise(mysqlForm.accordancesList).then((results)=>{
        //if needed, selecting again by the result
        mysqlForm["authorsList"] = [];
        results.forEach((row, index)=>{
          mysqlForm.authorsList.push([row.id_author]);
        });
        let pNouns = Promise.resolve(_select_nounsAttribution_unit_withPromise(mysqlForm.accordancesList));
        let pAuthors = Promise.resolve(_select_Users_Author_withPromise(mysqlForm.authorsList));

        return Promise.all([pNouns, pAuthors]).then((resultsStep2)=>{
          return new Promise((resolve, reject)=>{
            // then, compose the dataset all together
            let unitsRows = results.slice();
            let nounsRows = resultsStep2[0];
            let authorsRows = resultsStep2[1];

            let sendingData={
              unitBasic: {},
              authorBasic: {},
              temp: {}
            }

            sendingData.unitBasic = {
              unitId: unitsRows[0].id,
              authorId: unitsRows[0].id_author,
              pic_layer0: unitsRows[0].url_pic_layer0,
              created: unitsRows[0].established,
              nouns: nounsRows.map((row, index)=>{return row.name})
            };
            sendingData.authorBasic = {
              account: authorsRows[0].account,
              id: authorsRows[0].id
            }

            resolve(sendingData);
          })
        })
      }).then((sendingData)=>{
        _res_success(res, sendingData, "data req: unit basic, complete.");
      }).catch((errObj)=>{
        console.log("error occured during getting unit basic promise: "+errObj.err)
        if("status" in errObj){
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
  console.log('request: GET, units/basic');
  _handle_units_basic_GET(req, res);
})

module.exports = execute;
