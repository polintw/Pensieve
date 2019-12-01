const express = require('express');
const execute = express.Router();

const jwt = require('jsonwebtoken');
const {verify_key} = require('../../config/jwt.js');
const winston = require('../../config/winston.js');
const {_res_success,_res_success_201} = require('../utils/resHandler.js');
const _DB_marks = require('../../db/models/index').marks;
const _DB_attribution =  require('../../db/models/index').attribution;
const {
  UNITS_GENERAL,
  MARKS_UNITS,
  ATTRIBUTION_UNIT,
  NOUNS_NAME
} = require('../utils/queryIndicators.js');
const {
  _insert_basic,
  _insert_basic_Ignore,
  _insert_raw
} = require('../utils/dbInsertHandler.js');
const {
  _select_withPromise_Basic
} = require('../utils/dbSelectHandler.js');
const {
  _handler_err_BadReq,
  _handler_err_NotFound,
  _handler_err_Unauthorized,
  _handler_err_Internal
} = require('../utils/reserrHandler.js');

function _handle_unit_AuthorEditing(req, res){
  jwt.verify(req.headers['token'], verify_key, function(err, payload) {
    if (err) {
      _handler_err_Unauthorized(err, res)
    } else {
      const userId = payload.user_Id;
      const reqUnit = req.reqUnitId;
      let mysqlForm = {
        accordancesList: [[reqUnit]],
        marksSet: {insertion:[], update:[]},
        marksList: {update:[], deletion:[]}
      };

      //check user and unit combination!
      _select_withPromise_Basic(UNITS_GENERAL, mysqlForm.accordancesList).then((resultsUnit)=>{
        if(resultsUnit[0].id_author != userId){throw {err: "", status:400};}
      }).then(()=>{
        //first, check current records
        let pMarks = Promise.resolve(_select_withPromise_Basic(MARKS_UNITS, mysqlForm.accordancesList)),
            pAtrri = Promise.resolve(_DB_attribution.findAll({
              where: {id_unit: reqUnit} //Notice, due to 'paranoid' prop set in Sequelize Model,
              //this selection would exclude all attribution have been 'deleted' (not null in 'deletedAt')
            }).catch((errObj)=>{throw errObj}));
        return Promise.all([pAtrri, pMarks]);
      }).then(([resultsAttribution, resultsMarks])=>{
        let sendingData={};
        let reqMarksList = Array.from(req.body.joinedMarksList),
            nounsDeletionList = [],
            reqNounsNewList = Array.from(req.body.nouns.list);
        //for safety, all above variants use raw data from req and result

        //distinguish new, deleted, and modified marks
        resultsMarks.forEach((row, index)=>{
          if(row.id in req.body.joinedMarks){
            let markObj = req.body.joinedMarks[row.id];
            let editorString = JSON.stringify(markObj.editorContent); //notice, same part in the req.body would also be transformed
            mysqlForm.marksSet.update.push([
              row.id,
              reqUnit,
              userId,
              markObj.layer,
              markObj.top,
              markObj.left,
              markObj.serial,
              editorString
            ]);

            mysqlForm.marksList.update.push(row.id);
            //then, erase this one in the id list
            let position = reqMarksList.indexOf(row.id.toString()) ;
            reqMarksList.splice(position, 1);
          }else{
            mysqlForm.marksList.deletion.push(row.id);
          }
        });
        //the rest in the list should be the new
        reqMarksList.forEach((newMarkKey, index)=>{
          let markObj = req.body.joinedMarks[newMarkKey];
          let editorString = JSON.stringify(markObj.editorContent); //notice, same part in the req.body would also be transformed
          mysqlForm.marksSet.insertion.push({
            id_unit: reqUnit,
            id_author:  userId,
            layer:  markObj.layer,
            portion_top: markObj.top,
            portion_left: markObj.left,
            serial: markObj.serial,
            editor_content:  editorString
          });
        });
        //distinguish new, and deleted from attribution
        resultsAttribution.forEach((row, index)=>{
          if(row.id_noun in req.body.nouns.basic){ //if the nouns pass from client has already exist
            let position = reqNounsNewList.indexOf(row.id_noun) ;
            reqNounsNewList.splice(position, 1); //rm it from List going to insert
          }else{ //and going to rm the one that did not on the client's list
            nounsDeletionList.push(row.id_noun);
          }
        })

        let nounsNewSet = reqNounsNewList.map((id, index)=>{
          return [
            id,
            reqUnit,
            userId
          ]
        });
        //check the necessity of each action
        let pinsertNewAttribution = Promise.resolve(_insert_basic({table: 'attribution', col: '(id_noun, id_unit, id_author)'}, nounsNewSet)),
            //sequelize could not accept empty values (2018.11.26)
            pdeleteAttribution = nounsDeletionList.length>0?Promise.resolve(_DB_attribution.destroy({where: {id_noun: nounsDeletionList, id_unit: reqUnit}})):null,
            pinsertNewMarks = mysqlForm.marksSet.insertion.length>0?Promise.resolve(_DB_marks.bulkCreate(mysqlForm.marksSet.insertion, {fields: ['id_unit', 'id_author', 'layer','portion_top','portion_left','serial','editor_content']})):null,
            pdeleteMarks = mysqlForm.marksList.deletion.length>0?Promise.resolve(_DB_marks.destroy({where: {id: mysqlForm.marksList.deletion}})):null;
        //due to the query of mark update required the id, which could be modified from client
        //this kind of 'INSERT' could not use for the new marks insertion!
        let queryUpdate =('INSERT INTO '+
                "marks (id, id_unit, id_author, layer,portion_top,portion_left,serial,editor_content) "+
                'VALUES ? ON DUPLICATE KEY UPDATE '+
                'layer=VALUES(layer),portion_top=VALUES(portion_top),portion_left=VALUES(portion_left),serial=VALUES(serial),editor_content=VALUES(editor_content)');
        let pupdateMarks = Promise.resolve(_insert_raw(queryUpdate, mysqlForm.marksSet.update));
        return Promise.all([pinsertNewAttribution, pdeleteAttribution, pinsertNewMarks, pdeleteMarks, pupdateMarks]).then(()=>{return sendingData;});

      }).then((sendingData)=>{
        _res_success_201(res, sendingData, "data patch req: unit author editing, complete.");
      }).catch((errObj)=>{
        console.log("error occured during patching unit author editing promise: "+errObj.err)
        switch (errObj.status) {
          case 400:
            _handler_err_BadReq(errObj.err, res);
            break;
          case 404:
            _handler_err_NotFound(errObj.err, res);
            break;
          case 500:
            _handler_err_Internal(errObj.err, res);
            break;
          default:
            _handler_err_Internal(errObj.err?errObj.err:errObj, res);
        }
      });
    }
  })
}

execute.patch('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('PATCH: /unit @ '+req.reqUnitId);
  _handle_unit_AuthorEditing(req, res);
})


module.exports = execute;
