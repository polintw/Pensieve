const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_units = require('../../../db/models/index').units;
const _DB_usersUnits = require('../../../db/models/index').users_units;
const _DB_lastVisit_index = require('../../../db/models/index').lastvisit_index;
const _DB_unitsNodes_assign = require('../../../db/models/index').units_nodes_assign;
const _DB_usersNodesHomeland = require('../../../db/models/index').users_nodes_homeland;
const _DB_usersNodesResidence = require('../../../db/models/index').users_nodes_residence;

const {_res_success} = require('../../utils/resHandler.js');
const {
  _handle_ErrCatched,

} = require('../../utils/reserrHandler.js');


function _handle_GET_feedChainlist(req, res){
  const _find_fromHomeland_last = (userId)=>{
    return _DB_usersNodesHomeland.findOne({
      where: {
        id_user: userId,
        historyify: false
      }
    })
    .then((result)=>{
      return result;
    })
    .catch((err)=>{throw err})
  };
  const _find_fromResidence_last = (userId)=>{
    return _DB_usersNodesResidence.findOne({
      where: {
        id_user: userId,
        historyify: false
      }
    })
    .then((result)=>{
      return result;
    })
    .catch((err)=>{throw err})
  };

  const _find_Shared_last = (userId)=>{
    return _DB_units.findOne({
      where: {
        id_author: userId,
      },
      order: [ //make sure the order of arr are from latest
        Sequelize.literal('`createdAt` DESC') //and here, using 'literal' is due to some wierd behavior of sequelize,
        //it would make an Error if we provide col name by 'arr'
      ]
    })
    .then((result)=>{
      return result;
    })
    .catch((err)=>{throw err})
  };
  const _find_lastVisit_index = (userId)=>{
    return _DB_lastVisit_index.findOne({
      where: {
        id_user: userId,
      }
    })
    .then((result)=>{
      return result;
    })
    .catch((err)=>{throw err})
  };

  const _find_assigned_unread = (userId, belongList)=>{
    return _DB_usersUnits.findAll({
      where: {
        id_user: userId,
      }
    })
    .then((results)=>{
      //results represent all the units read by the user,
      //ask it to make a units list
      let readList = results.map((row, index)=>{
        return row.id_unit;
      });

      return _DB_unitsNodes_assign.findOne({
        where: {
          nodeAssigned: belongList,
          id_unit: {[Op.notIn]: readList}, //unread
          id_author: {[Op.ne]: userId} //not user him/herself
        },
        order: [ //make sure the order of arr are from latest
          Sequelize.literal('`createdAt` DESC') //and here, using 'literal' is due to some wierd behavior of sequelize,
          //it would make an Error if we provide col name by 'arr'
        ]
      })
      .catch((err)=>{throw err})
    }) //and we have to select from units for getting exposedId
    .then((resultAssign)=>{
      /*
      the resultAssign has 2 possibility:
      - has result, an unread assigned Unit, or
      - null, and we have to know why: read everything or no rec belong to Belong at all
      */
      if(!resultAssign){ // if the resultAssign 'Null'
        return _DB_unitsNodes_assign.findOne({
          where: {
            nodeAssigned: belongList,
          }
        })
        .then((result)=>{
          if(!!result){ //has some rec
            return 'recAllRead'
          } else return 'noRec';
        })
        .catch((err)=>{throw err})
      }else { //and if the result was not empty, select and return the unit data
        return _DB_units.findOne({
          where: {
            id: resultAssign.id_unit
          }
        })
        .then((resultUnit)=>{
          //we need not only the selection from units, but also the previous result from units_nodes_assign
          return {
            id_unit: resultUnit.id,
            exposedId: resultUnit.exposedId,
            id_author: resultUnit.id_author,
            id_primer: resultUnit.id_primer,
            nodeAssigned: resultAssign.nodeAssigned,
            createdAt: resultUnit.createdAt
          };
        });
      }
    })
    .catch((err)=>{throw err})
  };

  const _find_unit_random = ()=>{
    return _DB_units.findOne({
      order: [
        [Sequelize.fn('RAND')] //"RAND" is order for 'random' selection specific for mySQL
      ]
    })
    .catch((err)=>{throw err})
  };

  new Promise((resolve, reject)=>{
    const userId = req.extra.tokenUserId;

    let arrPromiseList = [ //select belong the user set
          new Promise((resolve, reject)=>{_find_Shared_last(userId).then((results)=>{resolve(results);});}),
          new Promise((resolve, reject)=>{_find_lastVisit_index(userId).then((results)=>{resolve(results);});}),
          new Promise((resolve, reject)=>{_find_fromResidence_last(userId).then((results)=>{resolve(results);});}),
          new Promise((resolve, reject)=>{_find_fromHomeland_last(userId).then((results)=>{resolve(results);});})
        ];

    Promise.all(arrPromiseList)
    .then((results)=>{
      let sendingData={ //default as the state res if no belong set at all
        displayOrder: [],
        unitsInfo: {}, // unitId: {id, form, toBelong:[], toBelongNew: {nodeId: bool}}
        popup: null,  //{id, toBelong: [], reason: 'firstify'}
        sharedify: false,
        belongRecify: false,
        temp: {}
      };
      let resultShared = results[0],
          resultVisit = results[1],
          resultRecResi = results[2],
          resultRecHome = results[3];

      //first, if the belongset was empty, just res empty set(but this shouldn't happen due to the api should only called if the client 'has' belongset)
      if(!resultRecResi && !resultRecHome) return Promise.resolve(sendingData);

      //and if any belong has been set,
      let belongList = []; //list used to select from assign
      if(!!resultRecResi){ belongList.push(resultRecResi.id_node);};
      if(!!resultRecHome){ belongList.push(resultRecHome.id_node)};

      return _find_assigned_unread(userId, belongList)
      .then((resultAssign)=>{ // Notice! the resultAssign was 'Not' an instance, it's a plain js obj
        //resultAssign could be one of 3: an unit row, 'noRec', or 'recAllRead'
        if(resultShared) { //sharedify ? set true and put into unitsInfo.
          sendingData.sharedify = true;
          sendingData.unitsInfo[resultShared.exposedId] = {
            unitId: resultShared.exposedId,
            form: 'shared',
            createdAt: resultShared.createdAt
          };
        };
        if(typeof resultAssign!== 'string'){ //typeof resultAssign !== 'string'? set belongRecify true and put into unitsInfo
          sendingData.belongRecify = true;
          sendingData.unitsInfo[resultAssign.exposedId] = {
            // unitId: {id, form, toBelong:[], toBelongNew: {nodeId: bool}}
            unitId: resultAssign.exposedId,
            form: 'assign',
            toBelong: [resultAssign.nodeAssigned],
            toBelongNew: {},
            createdAt: resultAssign.createdAt
          };
          sendingData.unitsInfo[resultAssign.exposedId]['toBelongNew'][resultAssign.nodeAssigned] = (resultAssign.createdAt > resultVisit.updatedAt) ? true : false;
          // meanwhile, check if this is a 'first time' after belong was set
          // compare the created time of record with last visit, but push it only if the assigned node was match to it
          if(!!resultRecResi ){
            if(resultRecResi.createdAt > resultVisit.updatedAt && resultRecResi.id_node == resultAssign.nodeAssigned){
              //{id, toBelong: [], reason: 'firstify'}
              sendingData.popup = {unitId: resultAssign.exposedId, toBelong: [resultAssign.nodeAssigned], reason: 'firstify'};
            }
          };
          if(!!resultRecHome ){
            if(resultRecHome.createdAt > resultVisit.updatedAt && resultRecHome.id_node == resultAssign.nodeAssigned){
              //{id, toBelong: [], reason: 'firstify'}
              sendingData.popup = {unitId: resultAssign.exposedId, toBelong: [resultAssign.nodeAssigned], reason: 'firstify'};
            }
          };
        }else if(resultAssign == 'recAllRead'){
          sendingData.belongRecify = true;
        };
        //and now, keys(unitsInfo) > 0? compare order, and set popup if the last visit time was earlier than assigned created
        let infoKeys = Object.keys(sendingData.unitsInfo);
        if(infoKeys.length >0){
          // determine the order: compare the createdAt between each unit
          sendingData.displayOrder = infoKeys.map((key, index)=>{ return key; }); //put every key into displayOrder
          function compare(key1, key2){
            return sendingData.unitsInfo[key1].createdAt - sendingData.unitsInfo[key2].createdAt
          };
          sendingData.displayOrder.sort(compare); //the displayOrder now was 'ordered'---earlier to latest
        };


        return sendingData;
      })
      .then((sendingData)=>{
        /*
        if !belongRecify !sharedify & order < 0: select units randomly
        i.e no unit can display even the user has set belong(s).
        */
        if(sendingData.displayOrder.length < 1){
          return _find_unit_random()
          .then((randomUnit)=>{
            sendingData.displayOrder.push(randomUnit.exposeId);
            sendingData.unitsInfo[randomUnit.exposedId] = {
              unitId: randomUnit.exposeId,
              form: 'assign' //perhaps should seperate ?
            };

            return sendingData;
          });
        //do nothing if the sendingData
        }else return sendingData;
      })
      .catch((err)=>{
        throw err
      });
    })
    .then((sendingData)=>{
      resolve(sendingData);
    }).catch((error)=>{
      reject(new internalError(error ,131));
    })
  }).then((sendingData)=>{
    _res_success(res, sendingData, "GET: user feed/chainlist, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: user feed/chainlist.');
  _handle_GET_feedChainlist(req, res);
})

module.exports = execute;
