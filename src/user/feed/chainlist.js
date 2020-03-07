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
          id_unit: {[Op.ne]: readList}, //unread
          id_author: {[Op.ne]: userId} //not user him/herself
        },
        order: [ //make sure the order of arr are from latest
          Sequelize.literal('`createdAt` DESC') //and here, using 'literal' is due to some wierd behavior of sequelize,
          //it would make an Error if we provide col name by 'arr'
        ]
      })
      .then((result)=>{
        return result;
      });
    })
    .catch((err)=>{throw err})
  };

  new Promise((resolve, reject)=>{
    const userId = req.extra.tokenUserId;
    /*
    A simplified algorithm.

    find belongsest >
    if(belongset) >
    keep createdAt of belongset/
    find from users_units by user +
    find unread _assign unit by belong(latest or not yet read, limit:1, not author)/
    find latest Shared (ify)/
    find lastvisit index >
    compare createdAt of belongset and lastvisit: firstsetify if belongset is later than lastvisit.
    compare createdAt of _assign[0], latest Shared, lastvisit:
    - Shared & _assign which earlier?
    - is last visit later than both? then only show the later one
    */
    let arrPromiseList = [ //select belong the user set
          new Promise((resolve, reject)=>{_find_fromResidence_last(userId).then((results)=>{resolve(results);});}),
          new Promise((resolve, reject)=>{_find_fromHomeland_last(userId).then((results)=>{resolve(results);});})
        ];

    Promise.all(arrPromiseList)
    .then((results)=>{
      let sendingData={
        orderFirst: {},
        orderSecond: {},
        firstsetify: false,
        temp: {}
      };
      let residence = !!results[0] ? results[0].id_node : false; //checking if the results was 'null'
      let homeland = !!results[1] ? results[1].id_node : false;
      //first, if the belongset was empty, just res empty set(but this shouldn't happen due to the api should only called if the client 'has' belongset)
      if(!residence && !homeland) return Promise.resolve(sendingData);
      //and if there has some record,
      let belongList = [];
      if(residence){ sendingData.temp['residTime']=results[0].createdAt; belongList.push(results[0].id_node)};
      if(homeland){ sendingData.temp['homelaTime']=results[1].createdAt; belongList.push(results[1].id_node)};

      let arrPSecondList = [ //select belong the user set
            new Promise((resolve, reject)=>{_find_Shared_last(userId).then((results)=>{resolve(results);});}),
            new Promise((resolve, reject)=>{_find_lastVisit_index(userId).then((results)=>{resolve(results);});}),
            new Promise((resolve, reject)=>{_find_assigned_unread(userId, belongList).then((results)=>{resolve(results);});}),
          ];
      return Promise.all(arrPSecondList)
      .then((resultsSec)=>{
        if(sendingData.temp['residTime'] < resultsSec[1] || sendingData.temp['homelaTime'] < resultsSec[1]){ //only happen when 'first set'
          sendingData.firstsetify = true;
        };
        let rowShared = arrPSecondList[0],
            rowLastVisit = arrPSecondList[1],
            rowAssign = arrPSecondList[2];
        if(rowLastVisit.createdAt> rowShared.createdAt && rowLastVisit.createdAt > rowAssign.createdAt){
          sendingData.orderFirst['unitId'] = rowShared.createdAt > rowAssign.createdAt ? rowShared.exposedId:
          rowAssign.id_unit;

          
        }

      })


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
