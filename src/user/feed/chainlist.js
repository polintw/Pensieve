const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_units = require('../../../db/models/index').units;
const _DB_responds = require('../../../db/models/index').responds;
const _DB_inspireds = require('../../../db/models/index').inspireds;
const _DB_usersUnits = require('../../../db/models/index').users_units;
const _DB_lastVisitIndex = require('../../../db/models/index').lastvisit_index;

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
  2) has respond but all read, select all again by respond list, then, pick latest, combine with id_primer back to client (similar to no.1)
    * a special case: the author of share of respond is client himself, still saw it as common
  sendingData {
    sharedPrimer: ?unitId,
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
    let sendingData={
      sharedPrimer: false,
      userShared: false,
      resToShared: false,
      resToRespond: false,
      latestShared: false,
      temp: {temp_unitIdKeyObj:{}}
    };
    /*
    So, distinguish query first:
    - with respond, means the req with right after user submit a new Shared, we are going to res 'that one' with its primer(if any)
    - no query at all, then going to select from any unread respond to previous Shared
    */

    if(!!req.query.respond){
      return _find_Shared_last()
      .then((result)=>{
        if(!!result) { //result might be 'null' due to findOne used
          sendingData.latestShared = result.id;
          sendingData['temp']['temp_unitIdKeyObj'][result.id] = 'latestShared';
          // and only if there is a primer---or just a general share
          if(!!result.id_primer){
            sendingData.sharedPrimer = result.id_primer;
            sendingData['temp']['temp_unitIdKeyObj'][result.id_primer] = 'sharedPrimer';
          }
        }

        return resolve(sendingData);
      })
      .catch((err)=>{
        return reject(err);
      });
    }

    let arrPromiseList = [
          new Promise((resolve, reject)=>{_selectAll_responds().then((results)=>{resolve(results);});}),
          new Promise((resolve, reject)=>{_selectAll_usersUnits().then((results)=>{resolve(results);});}),
        ];

    Promise.all(arrPromiseList)
    .then((results)=>{
      let resultResponds = results[0],
          resultUsersUnits = results[1];

      if(resultResponds.length < 1){
        return;
         //process stop here if the "if" condition was true
         // that is, we do not go to display anything to client
      };
      //else, if there were responds records
      //check if any one respond unread
      let readUnits = resultUsersUnits.map((row,index)=>{
        return row.id_unit
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
        sendingData['temp']['temp_unitIdKeyObj'][objToShared.unreadRespond[0]] = 'resToShared';
        sendingData['temp']['temp_unitIdKeyObj'][objToShared.respondsInfo[objToShared.unreadRespond[0]].primer] = 'userShared';

        return;
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
            sendingData['temp']['temp_unitIdKeyObj'][objToRespond.unreadRespond[0]] = 'resToRespond';
            sendingData['temp']['temp_unitIdKeyObj'][objToRespond.respondsInfo[objToRespond.unreadRespond[0]].primer] = 'resToShared';

            return ;
          }

        })
        .catch((err)=>{
          throw err
        });
      }

    })
    .then(()=>{
      resolve(sendingData);
    }).catch((error)=>{
      reject(new internalError(error ,131));
    })
  })
  .then((sendingData)=>{
    /*
    now, the sendingData contain either all false, or one or two unit by 'id'
    the thing is, we need to res to client the 'exposedId'
    */
    let unitsIdList = Object.keys(sendingData.temp.temp_unitIdKeyObj);
    if(unitsIdList.length > 0 ){ //any unit was set
      return _DB_units.findAll({
        where: {id: unitsIdList}
      })
      .then((resultUnits)=>{
        resultUnits.forEach((row, index) => {
          let targetKey = sendingData.temp.temp_unitIdKeyObj[row.id];
          sendingData[targetKey] = row.exposedId;
        });

        return sendingData;
      })
      .catch((err)=>{
        throw err
      });
    }
    else return sendingData;

  }).then((sendingData)=>{
    _res_success(res, sendingData, "GET: user feed/chainlist, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

async function _handle_GET_chainlistInspired(req, res){
  const userId = req.extra.tokenUserId;

  try{
    /*
    this function is going to select the 'new' inspired to user's contribution
    'new' means later than last visit.
    any other situation should be handle during the POST process + new table structure, or new table
    */
    let userContributions = await _DB_units.findAll({
      where: {id_author: userId}
    });
    let contributionsList = userContributions.map((row, index)=>{
      return row.id
    });
    // select lastVisit index
    let userLastVisit = await _DB_lastVisitIndex.findOne({
      where: {id_user: userId}
    });
    // now select inspired record 'new' to user
    let newInspired = await _DB_inspireds.findAll({
      where: { // any new inspired to contributions earlier than lastVisit, or createdAt <
        id_unit: contributionsList,
        createdAt: {[Op.gt]: userLastVisit.updatedAt}
      },
      // but, we just need to know "which" one has new inspired, no matter how 'many', so select only the max one represent
      attributes: [
        //'max' here combined with 'group' prop beneath,
        [Sequelize.fn('max', Sequelize.col('createdAt')), 'createdAt'], //fn(function, col, alias)
        'id_unit', //set attributes, so we also need to call every col we need
      ],
      group: 'id_unit' //Important. means we combined the rows by id_unit, each id_unit would only has one row
    });

    let inspiredUnitList = [];
    for( let i=0 ; i<2 && i< newInspired.length ; i++){
      //but now, the inspiredUnitList was composed by 'id', and we need 'exposedId'
      let targetUnit = newInspired[i].id_unit;
      let listIndex = contributionsList.indexOf(targetUnit);
      let targetExposedId = userContributions[listIndex].exposedId;
      inspiredUnitList.push(targetExposedId);
    };

    let sendingData={
      newInspiredList: inspiredUnitList,
      temp: {}
    };

    _res_success(res, sendingData, "GET: user feed/chainlist, inspired, complete.");
  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return;
  }
}

execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: user feed/chainlist.');
  // there is one exclusive condition, 'inspired' in query
  if("inspired" in req.query) _handle_GET_chainlistInspired(req, res)
  else _handle_GET_feedChainlist(req, res);
})

module.exports = execute;
