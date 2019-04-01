const express = require('express');
const execute = express.Router();

const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../config/jwt.js');
const winston = require('../../config/winston.js');
const {_res_success,_res_success_201} = require('../utils/resHandler.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_users = require('../../db/models/index').users;
const _DB_units = require('../../db/models/index').units;
const _DB_nouns = require('../../db/models/index').nouns;
const _DB_marks = require('../../db/models/index').marks;
const _DB_attribution =  require('../../db/models/index').attribution;
const _DB_inspired = require('../../db/models/index').inspired;
const _DB_notifications = require('../../db/models/index').notifications;
const _DB_lastvisitShared = require('../../db/models/index').lastvisit_shared;
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
  forbbidenError,
  internalError,
  authorizedError,
  notFoundError,
  _handle_ErrCatched,
  _handler_err_BadReq,
  _handler_err_NotFound,
  _handler_err_Unauthorized,
  _handler_err_Internal
} = require('../utils/reserrHandler.js');

function _handle_unit_Mount(req, res){
  new Promise((resolve, reject)=>{
    const reqToken = req.body.token || req.headers['token'] || req.query.token;
    const jwtVerified = jwt.verify(reqToken, verify_key);
    if (!jwtVerified) throw new internalError(jwtVerified, 32)

    const userId = jwtVerified.user_Id;
    const reqUnit = req.reqUnitId;

    const _promise_unitToNouns = function(tempData){
      return new Promise((resolveSub, rejectSub)=>{
        let selectQuery = 'SELECT id_noun FROM attribution WHERE id_unit=?';
        _DB_attribution.findAll({
          where: {id_unit: reqUnit},
          attributes: ['id_noun']
        }).then((results)=>{
          if (results.length > 0) {
            results.forEach(function(result, index){
              tempData['nouns'].list.push(result.id_noun);
              tempData['temp'].nounsKey.push([result.id_noun]);
            })
            resolveSub(tempData)
          } else {
            tempData.sendingData.nouns = tempData.nouns;
            let sendingData = Object.assign({}, tempData.sendingData);
            rejectSub(sendingData);
          }
        })
      }).then((tempData)=>{
        return new Promise((resolveSub, rejectSub)=>{
          _DB_nouns.findAll({
            where: {id: tempData['temp'].nounsKey},
            attributes: ['id', 'name', 'prefix']
          }).then((results)=>{
            results.forEach(function(result, index){
              tempData['nouns']['basic'][result.id] = {id:result.id, name: result.name, prefix: result.prefix};
            })
            //this part is a temp method before a whole update of this file.
            tempData.sendingData.nouns = tempData.nouns;
            let sendingData = Object.assign({}, tempData.sendingData);
            if (results.length < 1) {rejectSub(sendingData);}else{resolveSub(sendingData)};
          })
        })
      }).catch((thrown)=>{
        winston.error(`${"Error: empty selection from nouns or attribution."} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return thrown; //do not count for a 'true' error
      })
    };
    const _limitFn_viewer = (sendingData)=>{
      return _DB_inspired.findAll({
        where: {
          id_mark: [sendingData['temp']['marksKey']],
          id_user: userId
        },
        attributes: ['id_mark']
      }).then(function(inspired) {
        inspired.forEach((row, index)=>{
          sendingData['inspired'].push(row.id_mark.toString())
        });
        return (sendingData);
      }).catch((error)=>{
        throw new internalError(error ,131);//'throw' at this level, stop the process
      })
    };
    const _limitFn_author = (sendingData)=>{
      return _DB_notifiInspired.findAndCountAll({
        where: {id_unit:reqUnit}
      }).then((notifiedInspired)=>{
        sendingData.inspired = notifiedInspired.rows.map((row, index)=>{
          return row.id_mark.toString();
        });
        //destroy the records directly before pass sendingData
        return notifiedInspired.destroy().then(()=>{sendingData});
      }).catch((error)=>{
        throw new internalError(error ,131);//'throw' at this level, stop the process
      })
    };

    return _DB_units.findOne({
      where: {id: reqUnit}
    }).then((result)=>{
      let sendingData = {
        temp: {marksKey: []},
        marksObj: {},
        refsArr: [],
        nouns: {
          list: [],
          basic: {},
        },
        authorBasic: {},
        createdAt: "",
        identity: "",
        inspired: []
      }
      if (result) {
        sendingData['authorBasic']['authorId'] = result.id_author;
        sendingData['createdAt'] = result.createdAt;
        if(userId == result.id_author){
          sendingData['identity'] = "author"
        }else{
          sendingData['identity'] = "viewer"
        }
        return (sendingData)
      } else {
        return (sendingData)
      }
    }).then((sendingData)=>{
      return _DB_users.findOne({
        where: {id: sendingData['authorBasic']['authorId']},
        attributes: ['account','first_name','last_name']
      }).then((result)=>{
        if (result) {
          sendingData['authorBasic']['account'] = result.account;
          sendingData['authorBasic']['firstName'] = result.first_name;
          sendingData['authorBasic']['lastName'] = result.last_name;
          return(sendingData);
        } else {
          return(sendingData);
        }
      }).catch((error)=>{
        throw new internalError(error ,131);//'throw' at this level, stop the process
      })
    }).then((sendingData)=>{
      //this part has been rewritten to a newer style, prepareing for future modified
      let tempData = {
        nouns: {
          list: [],
          basic: {}
        },
        temp: {nounsKey: []},
        sendingData: sendingData
      }
      return _promise_unitToNouns(tempData)
    }).then((sendingData)=>{
      console.log('unit mount req: assemble marksObj.');
      return _DB_marks.findAll({
        where: {id_unit:reqUnit}
      }).then((results)=>{
        if (results.length > 0) {
          results.forEach(function(row, index){
            let obj = {
              top: row.portion_top,
              left: row.portion_left,
              editorContent:  row.editor_content?JSON.parse(row.editor_content):null,
              serial: row.serial,
              layer: row.layer
            };
            let markKey = row.id;
            sendingData['marksObj'][markKey]=obj;
            sendingData['temp']['marksKey'].push(row.id); //we use ORM now, no need to fullfill mysal module format
          })
          return (sendingData);
        } else {
          return (sendingData);
        }
      }).catch((error)=>{
        throw new internalError(error ,131);//'throw' at this level, stop the process
      })
    }).then((sendingData)=>{
      if(sendingData.identity == 'author') return _limitFn_author(sendingData)
      else{
        return _limitFn_viewer(sendingData)
      }
    }).then((sendingData)=>{
      _res_success(res, sendingData);
    }).catch((error)=>{
      //and 'reject' at here return to the parent level handler
      if(error.status){reject(error);return;}
      else{
        reject(new internalError(error, 131));
        return;
      }
    })
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
};


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
        return;
      }).then(()=>{
        //first, check current records
        let pMarks = Promise.resolve(_select_withPromise_Basic(MARKS_UNITS, mysqlForm.accordancesList)),
            pAttr = Promise.resolve(_select_withPromise_Basic(ATTRIBUTION_UNIT, mysqlForm.accordancesList));
        return Promise.all([pAttr, pMarks]);
      }).then(([resultsAttribution, resultsMarks])=>{
        let sendingData={};
        let reqMarksList = Array.from(req.body.joinedMarksList),
            nounsDeletionList = [],
            reqNounsNewList = Array.from(req.body.nouns.list),
            reqNewNames = [];
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
          if(row.id_noun in req.body.nouns.basic){
            let position = reqNounsNewList.indexOf(row.id_noun) ;
            reqNounsNewList.splice(position, 1);
          }else{
            nounsDeletionList.push(row.id_noun);
          }
        })

        //middle step, dealing with the new nouns
        reqNounsNewList.forEach((key,index)=>{
          reqNewNames.push([req.body.nouns.basic[key].name]);
        });

        return _insert_basic_Ignore({table: "nouns", col: "(name)"}, reqNewNames).then(()=>{
          //in the future, could consider a sepearate nouns creation process
          //it could made a trusted id list pass from the client after we completed the seperation
          //then free with the selection here
          return _select_withPromise_Basic(NOUNS_NAME, reqNewNames)
        }).then((resultsNouns)=>{
          let nounsNewSet = resultsNouns.map((row, index)=>{
            return [
              row.id,
              reqUnit,
              userId
            ]
          })
          //check the necessity of each action
          let pinsertNewAttribution = Promise.resolve(_insert_basic({table: 'attribution', col: '(id_noun, id_unit, id_author)'}, nounsNewSet)),
              //sequelize could not accept empty values (2018.11.26)
              pdeleteAttribution = nounsDeletionList.length>0?Promise.resolve(_DB_attribution.destroy({where: {id_noun: nounsDeletionList}})):null,
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
        })
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


execute.get('/', function(req, res){
  console.log('get unit request: '+ req.reqUnitId);
  _handle_unit_Mount(req, res);
})

execute.patch('/', function(req, res){
  console.log('get patch request for unit: '+ req.reqUnitId);
  _handle_unit_AuthorEditing(req, res);
})


module.exports = execute
