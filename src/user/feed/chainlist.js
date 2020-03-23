const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_units = require('../../../db/models/index').units;
const _DB_responds = require('../../../db/models/index').responds;
const _DB_usersUnits = require('../../../db/models/index').users_units;

const {_res_success} = require('../../utils/resHandler.js');
const {
  _handle_ErrCatched,

} = require('../../utils/reserrHandler.js');


function _handle_GET_feedChainlist(req, res){
  /*
  select all by userId from respond(by primer_author),
  select all from users_units
  >>
  check any respond not read:
  1) at least one unread respond, pick latest(by primer_createdAt), combine with id_primer to client
  2) no respond at all, select latest one by this user from units
  3) has respond but all read, select all again by respond list, then, pick latest, combine with id_primer back to client (similar to no.1)
    * a special case: the author of share of respond is client himself, still saw it as common
  sendingData {
    userShared: ?unitId,
    resToShared: ?unitId,
    resToRespond: ?unitId,
    shareToRespond: ?unitId
  }
  */

  const userId = req.extra.tokenUserId;

  const _selectAll_responds = ()=>{
    return _DB_responds.findAll({
      where: {primer_author: userId}
    })
    .then((result)=>{
      return result;
    })
    .catch((err)=>{throw err})
  };
  const _selectAll_usersUnits = ()=>{
    return _DB_usersUnits.findAll({
      where: {id_user: userId}
    })
    .then((result)=>{
      return result;
    })
    .catch((err)=>{throw err})
  };
  const _find_Shared_last = ()=>{
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

  new Promise((resolve, reject)=>{

    let arrPromiseList = [ //select belong the user set
          new Promise((resolve, reject)=>{_selectAll_responds().then((results)=>{resolve(results);});}),
          new Promise((resolve, reject)=>{_selectAll_usersUnits().then((results)=>{resolve(results);});}),
        ];

    Promise.all(arrPromiseList)
    .then((results)=>{
      let resultResponds = results[0],
          resultUsersUnits = results[1];

      let sendingData={
        userShared: false,
        resToShared: false,
        resToRespond: false,
        temp: {}
      };
      //first, if the belongset was empty, just res empty set(but this shouldn't happen due to the api should only called if the client 'has' belongset)
      if(resultResponds.length < 1){
        return _find_Shared_last()
        .then((result)=>{ //result might be 'null' due to findOne used
          sendingData.userShared = !!result ? result.exposedId : false;

          return Promise.resolve(sendingData);
        })
      }; //process stop here if the "if" condition was true;
      //else, if there were responds records
      //check if any one respond unread
      let readUnits = resultUsersUnits.map((row,index)=>{
        return row.id
      });

      function unreadUnitsify (unitsInstance){
        let respondsUnits=[], respondsInfo={};
        unitsInstance.forEach((row,index)=>{
          respondsUnits.push(row.id_unit);
          respondsInfo[row.id_unit]={
            primer: row.id_primer,
            primer_createdAt: row.primer_createdAt
          };
        });
        let unreadRespond = respondsUnits.filter((unitId,index)=>{
          return readUnits.indexOf(unitId) < 0
        });
        return ({
          unreadRespond:unreadRespond,
          respondsUnits: respondsUnits,
          respondsInfo: respondsInfo
        });
      };
      //check if any unread among the respond to Shared
      let objToShared = unreadUnitsify(resultResponds);

      if(objToShared.unreadRespond.length > 0){ //if there are any respond to SHared unread
        objToShared.unreadRespond.sort((a,b)=>{
          //we want the bigger 'order first', so reverse the sort
          return (objToShared.respondsInfo[a].primer_createdAt > objToShared.respondsInfo[b].primer_createdAt)? -1 : 1;
        });
        sendingData.resToShared= objToShared.unreadRespond[0];
        sendingData.userShared = objToShared.respondsInfo[objToShared.unreadRespond[0]].primer;

        return Promise.resolve(sendingData);
      }
      else{ //has responds, but all have been read, we check deeper to 'if any respond to responds'
        return _DB_responds.findAll({
          where: {id_primer: objToShared.respondsUnits}
        })
        .then((resultsToRespond)=>{
          let objToRespond = unreadUnitsify(resultsToRespond);
          //Notice! from this line, the var 'respondsUnits' & 'respondsInfo' have been modified and represented to result of toResponds
          if(objToRespond.unreadRespond.length > 0){
            objToRespond.unreadRespond.sort((a,b)=>{
              //we want the bigger 'order first', so reverse the sort
              return (objToRespond.respondsInfo[a].primer_createdAt > objToRespond.respondsInfo[b].primer_createdAt)? -1 : 1;
            });
            sendingData.resToRespond= objToRespond.unreadRespond[0];
            sendingData.resToShared = objToRespond.respondsInfo[objToRespond.unreadRespond[0]].primer;

            return Promise.resolve(sendingData);
          }
          else{
            /*
            finally, no unread to the Shared, but also no unread to responds,
            then we res the last shard, and the latest respond to it
            */
            //similar to process above, but this time, we use 'respondsUnits' as base
            objToShared.respondsUnits.sort((a,b)=>{
              //we want the bigger 'order first', so reverse the sort
              return (objToShared.respondsInfo[a].primer_createdAt > objToShared.respondsInfo[b].primer_createdAt)? -1 : 1;
            });
            sendingData.resToShared= objToShared.respondsUnits[0];
            sendingData.userShared = objToShared.respondsInfo[objToShared.respondsUnits[0]].primer;

            return Promise.resolve(sendingData);
          }
        })
        .catch((err)=>{
          throw err
        });
      }

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
