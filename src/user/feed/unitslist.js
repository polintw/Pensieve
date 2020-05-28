const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_units = require('../../../db/models/index').units;
const _DB_usersUnits = require('../../../db/models/index').users_units;
const _DB_unitsNodes_assign = require('../../../db/models/index').units_nodes_assign;
const _DB_usersNodesHomeland = require('../../../db/models/index').users_nodes_homeland;
const _DB_usersNodesResidence = require('../../../db/models/index').users_nodes_residence;

const {_res_success} = require('../../utils/resHandler.js');
const {
  _handle_ErrCatched,
  forbbidenError,
  internalError,
  validationError
} = require('../../utils/reserrHandler.js');
const {selectNodesParent} = require('../../nouns/utils.js');


async function _handle_GET_feedUnitslist_assigned(req, res){

  const userId = req.extra.tokenUserId;
  const lastVisit = new Date(req.query.visitBase); // param from query could only be parse as 'string', we need to turn it into time
  const lastUnitTime = !!req.query.listUnitBase ? new Date(req.query.listUnitBase): new Date(); // basically, undefined listUnitBase means first landing to the page
  const userHomeland = await _DB_usersNodesHomeland.findOne({
    where: {
      id_user: userId,
      historyify: false
    }
  })
  .then((result)=>{
    return !!result ? result: false;
  })
  .catch((err)=>{ _handle_ErrCatched(new internalError("from _DB_usersNodesHomeland selection _handle_GET_feedUnitslist_assigned, "+err, 131), req, res);});
  const userResidence = await _DB_usersNodesResidence.findOne({
    where: {
      id_user: userId,
      historyify: false
    }
  })
  .then((result)=>{
    return !!result ? result: false;
  })
  .catch((err)=>{ _handle_ErrCatched(new internalError("from _DB_usersNodesResidence selection _handle_GET_feedUnitslist_assigned, "+err, 131), req, res);});
  const _find_assigned_unread = (userId, targetList)=>{
    let selectUserUnits = ()=>{
          return _DB_usersUnits.findAll({
            where: {
              id_user: userId,
            }
          }).then((result)=>{return result;});
        },
        selectNodesAssigned = ()=>{
          return _DB_unitsNodes_assign.findAll({
            where: {
              nodeAssigned: targetList,
              createdAt: {[Op.lt]: lastUnitTime}
            },
            order: [ //make sure the order of arr are from latest
              Sequelize.literal('`createdAt` DESC') //and here, using 'literal' is due to some wierd behavior of sequelize,
              //it would make an Error if we provide col name by 'arr'
            ],
            limit: 1024
          }).then((result)=>{return result;})
          .catch((err)=>{throw err});
        };

    return Promise.all([
      selectNodesAssigned(), selectUserUnits()
    ])
    .then(([resultNodesAssign, resultRead])=>{
      // the way we call: 「暴力展開」
      /*
      1) if newAssignedList > 12: return only first 12 of newAssignedList
      2) if newAssignedList < 12:
        a. weekLastAssignedList > 12: + return first 12 of weekLastAssignedList
        b. add unreadlist by weekBeforeAssignedList, .concat() weekLastAssignedList, > 12 ? return first 12 of concat : return all & scrolled: false
        c. even the concat length == 0 ! then mark scrolled: false
      */
      /*
      But Notice! '12' was a rough limit, it is always possible these 'list' actually contain units less than 12
      becuase the units_nodes_assign records allow duplicate---for different node assigned
      */
      let newAssignedList = resultNodesAssign.filter((row, index) => {
        return row.createdAt > lastVisit;
      });
      let weekLastAssignedList = resultNodesAssign.filter((row, index)=>{
        let weekBefore = new Date(lastVisit.getTime() - 604800000);
        return (row.createdAt > weekBefore && row.createdAt < lastVisit);
      });
      let cleanNewAssigned = newAssignedList.filter((row, index) => {
        return newAssignedList.indexOf(thisArg.)
      }, thisArg)

      if(newAssignedList.length > 12 ){
        let resList = newAssignedList.slice(0, 12);
        return {listUnread: resList, listBrowsed: []};
      }
      else if(weekLastAssignedList.length > 12 ){
        let resBrowsedList = weekLastAssignedList.slice(0, 12);
        return {listUnread: newAssignedList, listBrowsed: resBrowsedList};
      }
      else{
        // cut the unit newer than lastVisit & 1 week before lastVisit
        let assignedList = resultNodesAssign.map(row, index)=>{
          return row.id_unit;
        });
        let weekBeforeAssignedList = assignedList.slice(newAssignedList.length + weekLastAssignedList.length);
        let readList = resultRead.map((row, index)=>{
          return row.id_unit;
        });
        let unreadList = weekBeforeAssignedList.filter((row, index) => {
          return readList.indexOf(row.id_unit) < 0
        });
        let concatList = weekLastAssignedList.concat(unreadList);
        let resBrowsedList = (concatList.length > 12) ? concatList.slice(0, 12): concatList;
        return {listUnread: newAssignedList, listBrowsed: resBrowsedList};
      }

    }) //and we have to select from units for getting exposedId
    .then((selectResultObj)=>{
      let selectResultList = selectResultObj.listUnread.concat(selectResultObj.listBrowsed);
      let unitsList=[], unitsInfo={};
      /*
      it is possible that one unit has two assigned (for current situation, homeland & residence are both assigned),
      so we also need to clean it
      */
      selectResultList.forEach((row,index)=>{
        if(!(row.id_unit in unitsInfo)) { //check if this row represent a new unit first
          unitsList.push(row.id_unit);
          unitsInfo[row.id_unit] = {};
          unitsInfo[row.id_unit][row.belongTypes] = row.nodeAssigned; // put assigned info into a unit-oriented obj
        }
        else{ //means both 'homeland'/'residence' were assigned to same unit
          unitsInfo[row.id_unit][row.belongTypes] = row.nodeAssigned
          /*
          we now has a rule: Unit has set a homeland type assigned, only share to user 'belong to' that homeland,
          and we do the selection here when this only happen on both 'homeland'/'residence' were set currently
          */
          if(userHomeland.selfInclList.indexOf(unitsInfo[row.id_unit]['homeland']) < 0){
            delete unitsInfo[row.id_unit];
            let indexInList = unitsList.indexOf(row.id_unit);
            unitsList.splice(indexInList, 1)};
        };
      });
      return _DB_units.findAll({
        where: {
          id: unitsList
        }
      })
      .then((resultUnit)=>{
        //we need not only the selection from units, but also the previous result from units_nodes_assign
        let assignedUnits = resultUnit.map((row, index)=>{
          return {
            id_unit: row.id,
            exposedId: row.exposedId,
            createdAt: row.createdAt,
            assignedInfo: unitsInfo[row.id],
          };
        });
        return assignedUnits;
      });

    })
    .catch((err)=>{throw err})
  };

  //default obj for res
  let sendingData={
    listUnread: [],
    listBrowsed: [],
    scrolled: false, // true if theere is any qualified Unit not yet res
    temp: {}
  };

  /*
  process start from here.
  */
  /*
  first check we have any neccessary to select
  */
  if(!userHomeland && !userResidence) { // if both homeland and residence do not be set
    // res default sendingData
    _res_success(res, sendingData, "GET: user feed/unitslist/assigned, complete.");
    return; //no need to go through any further
  };
  /*
  Selection start from here.
  gether belongs & their parent first to provide 'assigned'
  */
  let belongList = []; //list used to select from assign, would incl. parent of belong nodes.
  if(!!userResidence){ belongList.push(userResidence.id_node);};
  if(!!userHomeland){ belongList.push(userHomeland.id_node)};

  let ancestorsList = await selectNodesParent(belongList)
  .then((nodesInfo)=>{
    if(!!userResidence && userResidence.id_node in nodesInfo){
      let selfInclList = [], currentNode=nodesInfo[userResidence.id_node].id;
      while (!!currentNode) { //jump out until the currentNode was "null" or 'undefined'
        selfInclList.push(currentNode);
        currentNode = nodesInfo[currentNode].parent_id;
      }
      userResidence['selfInclList'] = selfInclList;
    }else if(!!userResidence) userResidence['selfInclList']= [userResidence.id_node];
    if(!!userHomeland && userHomeland.id_node in nodesInfo){
      let selfInclList = [], currentNode=nodesInfo[userHomeland.id_node].id;
      while (!!currentNode) { //jump out until the currentNode was "null" or 'undefined'
        selfInclList.push(currentNode);
        currentNode = nodesInfo[currentNode].parent_id;
      }
      userHomeland['selfInclList'] = selfInclList;
    }else if(!!userHomeland) userHomeland['selfInclList']= [userHomeland.id_node];

    //selectNodesParent()  would return an Obj by 'nodeId' as keys, so simply spread the keys to get the nodes list
    let ancestorKeys = Object.keys(nodesInfo);
    //Object.keys definetely return key in 'string', but id from userResidence/Homeland are 'int'
    //so next step is just a process to unified the item 'type'
    ancestorKeys = ancestorKeys.map((key,index)=>{
      return parseInt(key)
    })
    return ancestorKeys;
  });
  belongList = belongList.concat(ancestorsList);
  // make a list without duplicate
  let filteredList = belongList.filter((nodeId, index)=>{
    return index == belongList.indexOf(nodeId)
  });


  new Promise((resolve, reject)=>{
    _find_assigned_unread(userId, filteredList)

  }).then(()=>{
    _res_success(res, sendingData, "GET: user feed/unitslist/assigned, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

execute.get('/assigned', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: user feed/unitslist/assigned.');
  _handle_GET_feedUnitslist_assigned(req, res);
})

module.exports = execute;


const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_units = require('../../../db/models/index').units;
const _DB_usersUnits = require('../../../db/models/index').users_units;
const _DB_unitsNodes_assign = require('../../../db/models/index').units_nodes_assign;
const _DB_usersNodesHomeland = require('../../../db/models/index').users_nodes_homeland;
const _DB_usersNodesResidence = require('../../../db/models/index').users_nodes_residence;

const {_res_success} = require('../../utils/resHandler.js');
const {
  _handle_ErrCatched,
  forbbidenError,
  internalError,
  validationError
} = require('../../utils/reserrHandler.js');
const {selectNodesParent} = require('../../nouns/utils.js');


async function _handle_GET_feedUnitslist_assigned(req, res){

  const userId = req.extra.tokenUserId;
  const lastVisit = new Date(req.query.timeBase); // param from query could only be parse as 'string', we need to turn it into time
  const userHomeland = await _DB_usersNodesHomeland.findOne({
    where: {
      id_user: userId,
      historyify: false
    }
  })
  .then((result)=>{
    return !!result ? result: false;
  })
  .catch((err)=>{
    _handle_ErrCatched(new internalError("from _DB_usersNodesHomeland selection _handle_GET_feedUnitslist_assigned, "+err, 131), req, res);});
  const userResidence = await _DB_usersNodesResidence.findOne({
    where: {
      id_user: userId,
      historyify: false
    }
  })
  .then((result)=>{
    return !!result ? result: false;
  })
  .catch((err)=>{
    _handle_ErrCatched(new internalError("from _DB_usersNodesResidence selection _handle_GET_feedUnitslist_assigned, "+err, 131), req, res);});

  const _find_assigned_unread = (userId, targetList)=>{
    return Promise.all([
      _DB_usersUnits.findAll({
        where: {
          id_user: userId,
        }
      }).then((result)=>{return result;}),
      _DB_unitsNodes_assign.findAll({
        where: {
          nodeAssigned: targetList,
        },
        order: [ //make sure the order of arr are from latest
          Sequelize.literal('`createdAt` DESC') //and here, using 'literal' is due to some wierd behavior of sequelize,
          //it would make an Error if we provide col name by 'arr'
        ],
        limit: 48
      }).then((result)=>{return result;})
      .catch((err)=>{throw err})
    ])
    .then(([resultRead, resultNodesAssign])=>{
      //compare 2 selection, remove units read by the user from assignedList
      let readList = resultRead.map((row, index)=>{
        return row.id_unit;
      });
      let unreadList = resultNodesAssign.filter((row, index) => {
        return readList.indexOf(row.id_unit) < 0
      });

      if(unreadList.length > 0) return {status: 'unread', list: unreadList}
      else if(resultNodesAssign.length > 0){ //if all assigned were read, return the last one in selection(not the latest)
        let readOne = [];
        readOne.push(resultNodesAssign[resultNodesAssign.length-1]); //keep the instance in an arr
        return {status: 'allread', list: readOne};
      }
      else{ //which means no assigned to user's belong at all
        return _DB_unitsNodes_assign.findAll({
          where: {
            id_author: {[Op.ne]: userId} //any but not user him/herself
          },
          order: [
            Sequelize.literal('`createdAt` DESC') //and here, using 'literal' is due to some wierd behavior of sequelize,
            //it would make an Error if we provide col name by 'arr'
          ],
          limit: 1 //because we use 'findAll' to keep form consistency, we set 'limit' to mimic 'findOne'
        })
        .then((result)=>{
          return {status: 'noneassigned', list: result};
        })
        .catch((err)=>{throw err})
      }

    }) //and we have to select from units for getting exposedId
    .then((selectResultObj)=>{
      let unitsList=[],
          unitsInfo={listStatus: selectResultObj.status} ; //status was for whole list, set directly
      selectResultObj.list.forEach((row,index)=>{
        /*
        it is possible that one unit has two assigned (for current situation, homeland & residence are both assigned),
        so we also need to distinguish it
        */
        if(!(row.id_unit in unitsInfo)) { //check if this row represent a new unit first
          unitsList.push(row.id_unit);
          unitsInfo[row.id_unit] = {};
          unitsInfo[row.id_unit][row.belongTypes] = row.nodeAssigned; // put assigned info into a unit-oriented obj
        }
        else{ //means both 'homeland'/'residence' were assigned to same unit
          unitsInfo[row.id_unit][row.belongTypes] = row.nodeAssigned
          /*
          we now has a rule: Unit has set a homeland type assigned, only share to user 'belong to' that homeland,
          and we do the selection here when this only happen on both 'homeland'/'residence' were set currently
          */
          if(userHomeland.selfInclList.indexOf(unitsInfo[row.id_unit]['homeland']) < 0){
            delete unitsInfo[row.id_unit];
            let indexInList = unitsList.indexOf(row.id_unit);
            unitsList.splice(indexInList, 1)};
        };
      });
      return _DB_units.findAll({
        where: {
          id: unitsList
        }
      })
      .then((resultUnit)=>{
        //we need not only the selection from units, but also the previous result from units_nodes_assign
        let assignedUnits = resultUnit.map((row, index)=>{
          return {
            id_unit: row.id,
            exposedId: row.exposedId,
            createdAt: row.createdAt,
            assignedInfo: unitsInfo[row.id],
            listStatus: unitsInfo.listStatus //keep it in every unit, later would be check by foreach
          };
        });
        return assignedUnits;
      });

    })
    .catch((err)=>{throw err})
  };
  /*
  process start from here.
  */
  /*
  first check we have anyneccessary to select
  */
  if(!userHomeland && !userResidence) { // if both homeland and residence do not be set
    let sendingData={ //res a default obj
      listUnread: [],
      listUnreadNew: [],
      noneassigned: false,
      allread: false,
      temp: {}
    };
    _res_success(res, sendingData, "GET: user feed/unitslist/assigned, complete.");
    return; //no need to go through any further
  };
  /*
  Selection start from here.
  */
  let belongList = []; //list used to select from assign, would incl. parent of belong nodes.
  if(!!userResidence){ belongList.push(userResidence.id_node);};
  if(!!userHomeland){ belongList.push(userHomeland.id_node)};

  let ancestorsList = await selectNodesParent(belongList)
  .then((nodesInfo)=>{
    if(!!userResidence && userResidence.id_node in nodesInfo){
      let selfInclList = [], currentNode=nodesInfo[userResidence.id_node].id;
      while (!!currentNode) { //jump out until the currentNode was "null" or 'undefined'
        selfInclList.push(currentNode);
        currentNode = nodesInfo[currentNode].parent_id;
      }
      userResidence['selfInclList'] = selfInclList;
    }else if(!!userResidence) userResidence['selfInclList']= [userResidence.id_node];
    if(!!userHomeland && userHomeland.id_node in nodesInfo){
      let selfInclList = [], currentNode=nodesInfo[userHomeland.id_node].id;
      while (!!currentNode) { //jump out until the currentNode was "null" or 'undefined'
        selfInclList.push(currentNode);
        currentNode = nodesInfo[currentNode].parent_id;
      }
      userHomeland['selfInclList'] = selfInclList;
    }else if(!!userHomeland) userHomeland['selfInclList']= [userHomeland.id_node];

    //selectNodesParent()  would return an Obj by 'nodeId' as keys, so simply spread the keys to get the nodes list
    let ancestorKeys = Object.keys(nodesInfo);
    //Object.keys definetely return key in 'string', but id from userResidence/Homeland are 'int'
    //so next step is just a process to unified the item 'type'
    ancestorKeys = ancestorKeys.map((key,index)=>{
      return parseInt(key)
    })
    return ancestorKeys;
  });
  belongList = belongList.concat(ancestorsList);
  let filteredList = belongList.filter((nodeId, index)=>{
    return index == belongList.indexOf(nodeId) //to rm the duplicate
  });

  new Promise((resolve, reject)=>{
    _find_assigned_unread(userId, filteredList)
    .then((assignedUnits)=>{ // Notice! the resultAssign was 'Not' an instance, it's a plain js obj
      let sendingData={
        listUnread: [],
        listUnreadNew: [],
        noneassigned: false,
        allread: false,
        temp: {}
      };
      let newSetResi = (userResidence.createdAt > lastVisit)? true : false;
      let newSetHome = (userHomeland.createdAt > lastVisit)? true : false;

      assignedUnits.forEach((unitObj, index) => {
        /*
        distinguish: if the req are the 1st after belong set
        */
        // if one or both belong are new set, and! there is any assigned to it
        if( unitObj.listStatus != 'noneassigned' && newSetResi || newSetHome){
          //to do so is because there are units 'created' earlier than lastVisit, but if the belong was newly set, that's not the situation exclude them from 'new' to user
          if(newSetResi && 'residence' in unitObj.assignedInfo) {sendingData.listUnreadNew.push({unitId: unitObj.exposedId});return;};
          if(newSetHome && 'homeland' in unitObj.assignedInfo) {sendingData.listUnreadNew.push({unitId: unitObj.exposedId});return;};
        };
        //and if none new set, we just pick the new created after last visit
        if(unitObj.createdAt < lastVisit ){
          sendingData.listUnread.push({unitId: unitObj.exposedId});
        }
        else sendingData.listUnreadNew.push({unitId: unitObj.exposedId});

        sendingData.noneassigned = (unitObj.listStatus =='noneassigned') ? true : false; //lazy way to use status pass in every row of unit
        sendingData.allread = (unitObj.listStatus =='allread') ? true : false;
      });
      return sendingData;

    })
    .then((sendingData)=>{
      resolve(sendingData);
    }).catch((error)=>{
      reject(new internalError(error ,131));
    })
  }).then((sendingData)=>{
    _res_success(res, sendingData, "GET: user feed/unitslist/assigned, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

execute.get('/assigned', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: user feed/unitslist/assigned.');
  _handle_GET_feedUnitslist_assigned(req, res);
})

module.exports = execute;
