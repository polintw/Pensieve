const express = require('express');
const execute = express.Router();

const winston = require('../../../config/winston.js');
const {_res_success,_res_success_201} = require('../../utils/resHandler.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_users = require('../../../db/models/index').users;
const _DB_units = require('../../../db/models/index').units;
const _DB_paths = require('../../../db/models/index').paths;
const _DB_nouns = require('../../../db/models/index').nouns;
const _DB_marks = require('../../../db/models/index').marks;
const _DB_marksContent = require('../../../db/models/index').marks_content;
const _DB_unitsStatInteract = require('../../../db/models/index').units_stat_interact;
const _DB_attribution =  require('../../../db/models/index').attribution;

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

const _submitUsersUnits = require('./updateUsersUnits.js');

async function _select_pathAuthor(sendingData){
  return await _DB_paths.findOne({
    where: { id: sendingData['authorBasic']['authorId'] }
  }).then((result) => {
    if (result) {
      sendingData['authorBasic']['account'] = result.name;
      sendingData['authorBasic']['pageLink'] = result.pathName;
      return (sendingData);
    } else {
      return (sendingData);
    }
  }).catch((error) => {
    throw new internalError("throw by /units/plain/_unit_mount, " + error, 131);//'throw' at this level, stop the process
  })
}

function _handle_unit_Mount(req, res){
  //This api allow empty token,
  //would be after the permission check, with tokenify in req.extra
  const userId = req.extra.tokenify ? req.extra.tokenUserId: '';
  const reqExposedId = req.reqExposedId;

  new Promise((resolve, reject)=>{
    const _unit_Nouns = function(tempData){
      return new Promise((resolveSub, rejectSub)=>{
        _DB_attribution.findAll({
          where: {
            id_unit: tempData.sendingData.temp.internalId
          }, //Notice, due to 'paranoid' prop set in Sequelize Model,
          //this selection would exclude all attribution have been 'deleted' (not null in 'deletedAt')
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
        where: {id_unit: sendingData.temp.internalId}
      }).then((results)=>{
        if (results.length > 0) { //something or [] (empty)
          results.forEach(function(row, index){
            let obj = {
              top: row.portion_top,
              left: row.portion_left,
              serial: row.serial,
              layer: row.layer
            };
            let markKey = row.id;
            sendingData['marksObj'][markKey]=obj;

          })
          return (sendingData);
        } else {
          return (sendingData);
        }

      }).then((sendingData) => {
        //compose editorContent for each mark in this section.
        return _DB_marksContent.findAll({
          where: {
            id_unit: sendingData.temp.internalId
            }
        })
        .then((resultsMarksContent)=>{
          resultsMarksContent.forEach((row, index)=>{
            //editorContent was in form: {blocks:[], entityMap:{}}
            sendingData.marksObj[row.id_mark]['editorContent'] = {
              blocks: [],
              entityMap: JSON.parse(row.contentEntityMap)
            };
            /*
            and Notive, every col here still remain in 'string', so parse them.
            */
            let blockLigntening=JSON.parse(row.contentBlocks_Light),
                textByBlocks=JSON.parse(row.text_byBlocks),
                inlineStyleRangesByBlocks=JSON.parse(row.inlineStyleRanges_byBlocks),
                entityRangesByBlocks=JSON.parse(row.entityRanges_byBlocks),
                dataByBlocks=JSON.parse(row.data_byBlocks);

            blockLigntening.forEach((blockBasic, index) => {
              blockBasic['text'] = textByBlocks[blockBasic.key]
              blockBasic['inlineStyleRanges'] = inlineStyleRangesByBlocks[blockBasic.key]
              blockBasic['entityRanges'] = entityRangesByBlocks[blockBasic.key]
              blockBasic['data'] = dataByBlocks[blockBasic.key]

              sendingData.marksObj[row.id_mark]['editorContent'].blocks.push(blockBasic);
            });
          });

          return sendingData;
        })
        .catch((err)=>{throw err});

      }).catch((error)=>{
        throw new internalError("throw by /units/plain/_unit_mount, "+error ,131);//'throw' at this level, stop the process
      })
    };

    return _DB_units.findOne({
      where: {exposedId: reqExposedId}
    }).then((result)=>{
      let sendingData = {
        temp: {internalId: ''},
        marksObj: {},
        refsArr: [],
        nouns: {
          list: [],
          basic: {},
        },
        authorBasic: {},
        createdAt: "",
        identity: "visitor", // default as a 'no token' visitor
        primerify: false,
        outBoundLink: {main:''},
        imgLocation: {longitude: null, latitude: null}
      }
      if (!!result) { //make sure there is a unit with the id (would be 'null' if not exist)
        sendingData['authorBasic']['authorId'] = (result.author_identity== 'user') ?  result.id_author: result.used_authorId;
        sendingData['authorBasic']['authorIdentity'] = result.author_identity; // 'user' or 'pathProject'
        sendingData['outBoundLink'] = { main: result.outboundLink_main };
        sendingData['imgLocation'] = {
          longitude: result.longitude_img,
          latitude: result.latitude_img
        };
        sendingData['createdAt'] = result.createdAt;
        sendingData['temp']['internalId'] = result.id; //the id used as 'id_unit' among database.
        if(userId == result.id_author){
          sendingData['identity'] = "author"
        }
        else if(req.extra.tokenify){ //at least has a token
          sendingData['identity'] = "viewer"
        }
        sendingData['primerify'] = !!result.id_primer? true:false; // this api was a 'token free', Do NOT append another id here.

        return (sendingData);
      } else { //like the id is wrong or even not exist
        //reject directly, skipping all the process afterward
        reject(new notFoundError("this unit does not exist. please use a valid link.", 34));
      }
    }).then((sendingData)=>{
      if (sendingData['authorBasic']['authorIdentity'] == 'pathProject'){ return _select_pathAuthor(sendingData)};
      // condition else
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
      let cpInJSON = JSON.stringify(sendingData); // part of data (i.e unitId) would be used later in internal process, so keep it by copy
      _res_success(res, sendingData);
      //after all the function res needed, processing the internal process
      //unit reach status specific here
      let cpInDeep = JSON.parse(cpInJSON);
      resolve({userId: userId, unitId: cpInDeep.temp.internalId});
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
    return Promise.reject();
    //we still need to 'return', but return a reject(),
    //otherwise it would still be seen as 'handled', and go to the next .then()
  }).then((data)=>{
    //start processing the internal process which are not related to res
    //But, the one _submitUsersUnits need a 'login user', not allow if no token
    const processByTokenify = ()=>{
      if(req.extra.tokenify){
        return _submitUsersUnits(data.unitId, data.userId) //records relation between users units
      }
      else{ // if no token, save the data to unsignedLoad in units_stat_interact
        return new Promise((resolve, reject)=>{
          _DB_unitsStatInteract.findOne({
            where: {
              id_unit: data.unitId
            }
          })
          .then(result =>{
            const currentLoadCount = result.times_unsignedLoad;
            return _DB_unitsStatInteract.update(
              {times_unsignedLoad: currentLoadCount+1},
              {where: {id_unit: data.unitId}}
            )
          })
          .then(result => {
            resolve();
          })
          .catch((err)=>{
            reject("throw by Promise in processByTokenify() in units/single.js, "+err);
          });
        })
      };
    };

    return processByTokenify()
    .catch((error)=>{
      /*
      Main error handler for whole backend process!
      the backend process has its own error catch, different from the previous process.
      and throw to upper catch just to make a clear structure.
      */
      winston.error(`${"Internal process at single Unit req, "} ${error} ; ${"'"+req.originalUrl} , ${req.method+"', "} , ${req.ip}`);
    });
  })
  .catch((error)=>{
    //nothing need to happend here, just a catch to deal with chain design(.then() after .catch())
  });
};


execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /unit @ '+req.reqExposedId);
  _handle_unit_Mount(req, res);
})


module.exports = execute
