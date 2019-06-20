const express = require('express');
const execute = express.Router();

const jwt = require('jsonwebtoken');
const {verify_key} = require('../../../config/jwt.js');
const winston = require('../../../config/winston.js');
const {_res_success,_res_success_201} = require('../../utils/resHandler.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_users = require('../../../db/models/index').users;
const _DB_units = require('../../../db/models/index').units;
const _DB_nouns = require('../../../db/models/index').nouns;
const _DB_marks = require('../../../db/models/index').marks;
const _DB_inspired = require('../../../db/models/index').inspired;
const _DB_attribution =  require('../../../db/models/index').attribution;
const _DB_notifications = require('../../../db/models/index').notifications;
const _DB_notifiInspired = require('../../../db/models/index').notifi_inspired;
const {
  _select_withPromise_Basic
} = require('../../utils/dbSelectHandler.js');
const {
  forbbidenError,
  internalError,
  authorizedError,
  notFoundError,
  _handle_ErrCatched,
} = require('../../utils/reserrHandler.js');
const _touchedStatus = require('./unitTouchedStatus.js');

function _handle_unit_Mount(req, res){
  new Promise((resolve, reject)=>{
    const reqToken = req.body.token || req.headers['token'] || req.query.token;
    const jwtVerified = jwt.verify(reqToken, verify_key);
    if (!jwtVerified) throw new internalError(jwtVerified, 32)

    const userId = jwtVerified.user_Id;
    const reqUnit = req.reqUnitId;

    const _unit_Nouns = function(tempData){
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
    const _unit_Marks = (sendingData)=>{
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
            sendingData['marksInteraction'][markKey]={
              notify: false,
              inspired:0
            }; //set 0 instead of 'false' is because we need to 'plus' number if there are notifications for author
          })
          return (sendingData);
        } else {
          return (sendingData);
        }
      }).catch((error)=>{
        throw new internalError("throw by /units/plain/_unit_mount, "+error ,131);//'throw' at this level, stop the process
      })
    };
    const _unit_identity_Viewer = (sendingData)=>{
      return _DB_inspired.findAll({
        where: {
          id_mark: [sendingData['temp']['marksKey']],
          id_user: userId
        },
        attributes: ['id_mark']
      }).then(function(inspired) {
        inspired.forEach((row, index)=>{
          sendingData['marksInteraction'][row.id_mark]['inspired']=true;
        });
        return (sendingData);
      }).catch((error)=>{
        throw new internalError("throw by /units/plain/_unit_mount, "+error ,131);//'throw' at this level, stop the process
      })
    };
    const _unit_identity_Author = (sendingData)=>{
      //deal with notifications to mark first, and count inspired.
      //But! Notications check should have it's own api to deal, seperated from here.

      return _DB_notifiInspired.findAndCountAll({
        where: {id_unit:reqUnit}
      }).then((notifiedInspired)=>{
         notifiedInspired.rows.map((row, index)=>{
           sendingData['marksInteraction'][row.id_mark]['notify'] = true;
        });
        return sendingData;
      }).then((sendingData)=>{
        //notifications to mark, update the 'status' of notifications if we have open/read it
        return _DB_notifications.update(
          {status: 'delivered'},
          {where: {
            id_unit: reqUnit,
            id_reciever: userId,
            type: [10] //only choose type relate to a single Unit
          }}
        ).then(()=>{
          return sendingData;
        }).catch((error)=>{
          throw new internalError("throw by /units/plain/_unit_mount, "+error ,131);//'throw' at this level, stop the process
        })
      }).then((sendingData)=>{
        //notifications to mark, destroy the records directly before pass sendingData through
        return _DB_notifiInspired.destroy({
          where:{id_unit:reqUnit}
        }).then(()=>{
          return sendingData;
        }).catch((error)=>{
          throw new internalError("throw by /units/plain/_unit_mount, "+error ,131);//'throw' at this level, stop the process
        })
      }).then((sendingData)=>{
        //inspired count, select directly from inspired table
        return _DB_inspired.findAll({
          where: {
            id_mark: [sendingData['temp']['marksKey']] //here is the difference from _Viewer
          },
          attributes: ['id_mark']
        }).then(function(inspired) {
          inspired.forEach((row, index)=>{
            sendingData['marksInteraction'][row.id_mark]['inspired'] += 1;
          });
          return (sendingData);
        }).catch((error)=>{
          throw new internalError("throw by /units/plain/_unit_mount, "+error ,131);//'throw' at this level, stop the process
        })
      }).catch((error)=>{
        if(error.status){throw (error);}
        else{
          throw new internalError("throw by /units/plain/_unit_mount, "+error, 131);
        }
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
        marksInteraction: {}
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
        throw new internalError("throw by /units/plain/_unit_mount, "+error ,131);//'throw' at this level, stop the process
      })
    }).then((sendingData)=>{
      let tempData = {
        nouns: {
          list: [],
          basic: {}
        },
        temp: {nounsKey: []},
        sendingData: sendingData
      }
      return _unit_Nouns(tempData);
    }).then((sendingData)=>{
      return _unit_Marks(sendingData);
    }).then((sendingData)=>{
      if(sendingData.identity == 'author') return _unit_identity_Author(sendingData)
      else{
        return _unit_identity_Viewer(sendingData);
      }
    }).then((sendingData)=>{
      _res_success(res, sendingData);
      //after all the function res needed, processing the internal process
      //unit touched status specific here
      resolve({userId: userId, unitId: reqUnit});
    }).catch((error)=>{
      //and 'reject' at here return to the parent level handler
      if(error.status){reject(error);return;}
      else{
        reject(new internalError("throw by /units/plain/_unit_mount, "+error, 131));
        return;
      }
    });
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  }).then((data)=>{
    //start processing the internal process which are not related to res
    _touchedStatus(data.reqUnit, data.userId);
  }).catch((error)=>{
    //currently, only touchedStatus are needed
    winston.error(`${"Internal process at "} ; ${"'"+req.originalUrl} , ${req.method+"', "} , ${req.ip}, ${"for "+"touchedStatus"}`);
  });
};


execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /unit @ '+req.reqUnitId);
  _handle_unit_Mount(req, res);
})


module.exports = execute
