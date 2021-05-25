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
const {
  selectNodesParent,
  selectNodesChildren
} = require('../../nouns/utils.js');


async function _handle_GET_feedUnitslist_assigned(req, res){

  const userId = req.extra.tokenUserId;
  //now, we to prepared a few thnigs first:
  //user last visit time, created time of last Unit res to client in last req, and users' belongs.
  //but it is possible, the 'date' in query are not a 'date', and param from query could only be parse as 'string', we need to turn it into time
  let visitBase = new Date(req.query.visitBase), unitBase = new Date(req.query.listUnitBase);
  const lastVisit = !isNaN(visitBase) ? visitBase : new Date();
  const lastUnitTime = !isNaN(unitBase) ? unitBase : new Date(); // basically, undefined listUnitBase means first landing to the page
  // get users' belong set
  let userHomeland, userResidence;
  await _DB_usersNodesHomeland.findOne({
    where: {
      id_user: userId,
      historyify: false
    }
  })
  .then((result)=>{
    userHomeland = !!result ? result: false;
    return;
  })
  .catch((err)=>{ _handle_ErrCatched(new internalError("from _DB_usersNodesHomeland selection _handle_GET_feedUnitslist_assigned, "+err, 131), req, res);});
  await _DB_usersNodesResidence.findOne({
    where: {
      id_user: userId,
      historyify: false
    }
  })
  .then((result)=>{
    userResidence = !!result ? result: false;
    return;
  })
  .catch((err)=>{ _handle_ErrCatched(new internalError("from _DB_usersNodesResidence selection _handle_GET_feedUnitslist_assigned, "+err, 131), req, res);});
  // here we then has a f() later would be user to preserve the parent list for both userHomeland / userResidence
  const _presv_ParentsByBelong = (type, parentNodesInfo)=> {
    let currentInstance = (type == "homeland") ? userHomeland : userResidence ; // would be instance or null, depend on belong settong
    if(!!currentInstance && currentInstance.id_node in parentNodesInfo){
      let selfInclList = [], currentNode=parentNodesInfo[currentInstance.id_node].id;
      while (!!currentNode) { //jump out until the currentNode was "null" or 'undefined'
        selfInclList.push(currentNode);
        currentNode = parentNodesInfo[currentNode].parent_id;
      }
      currentInstance['selfInclList'] = selfInclList;
    }
    else if(!!currentInstance) currentInstance['selfInclList']= [currentInstance.id_node]; // already top wuthout parent
  };

  const _find_assigned_unread = ( targetList)=>{
    let selectUserUnits = ()=>{ // select read records
          return _DB_usersUnits.findAll({
            where: {
              id_user: userId,
            }
          }).then((result)=>{return result;});
        },
        selectNodesAssigned = ()=>{ // select units by units_nodes_assign
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
    let listObj = {
      newAssignedList: [],
      weekLastAssignedList: [],
      weekBeforeAssignedList: []
    };
    let weekBefore = new Date(lastVisit.getTime() - 777600000); // not 'week', is 9 days before lastVisit
    let unitsInfo = {}; // to keep belong type of each assigned unit

    return Promise.all([
      selectNodesAssigned(), selectUserUnits()
    ])
    .then(([resultNodesAssign, resultRead])=>{
      // seperate rows(units) by created time
      // the way we call: 「暴力展開」
      //seperate each assigned unit to different list by created time
      resultNodesAssign.forEach((row, index) => {
        let rowCreatedAt = row.createdAt;
        let listName='';
        if(rowCreatedAt > lastVisit){ // new after last visit
          listName = 'newAssignedList';
        }
        else if(rowCreatedAt > weekBefore && rowCreatedAt < lastVisit){
          listName = 'weekLastAssignedList';
        }
        else{
          listName = 'weekBeforeAssignedList';
        };
        // make a obj contain info about this assigned unit & put in list
        if(!(row.id_unit in unitsInfo)) {
          listObj[listName].push(row.id_unit);
          unitsInfo[row.id_unit] = {};
          unitsInfo[row.id_unit][row.belongTypes] = row.nodeAssigned; // put assigned info into a unit-oriented obj
        }
        else{ //means more than one assigned node to same unit, already in a list by created time
          unitsInfo[row.id_unit][row.belongTypes] = row.nodeAssigned
        };
      });

      /*
      1) if newAssignedList > 12: return only first 12 of newAssignedList
      2) if newAssignedList < 12:
        a. weekLastAssignedList > 12: + return first 12 of weekLastAssignedList
        b. add unreadlist by weekBeforeAssignedList, .concat() weekLastAssignedList, > 12 ? return first 12 of concat : return all & scrolled: false
        c. even the concat length == 0 ! then mark scrolled: false
      */
      if(listObj.newAssignedList.length > 12 ){
        let resList = listObj.newAssignedList.slice(0, 12);
        return {listUnread: resList, listBrowsed: [], scrolled: true};
      }
      else if(listObj.weekLastAssignedList.length > 12 ){
        let resBrowsedList = listObj.weekLastAssignedList.slice(0, 12);
        return {listUnread: listObj.newAssignedList, listBrowsed: resBrowsedList,　scrolled: true };
      }
      else{
        // need to res weekBeforeAssignedList, then have to rm read from list first
        let readList = resultRead.map((row, index)=>{
          return row.id_unit;
        });
        let unreadList = listObj.weekBeforeAssignedList.filter((unitId, index) => {
          return readList.indexOf(unitId) < 0
        });
        let concatList = listObj.weekLastAssignedList.concat(unreadList);
        let resBrowsedList = (concatList.length > 12) ? concatList.slice(0, 12): concatList;
        return {listUnread: listObj.newAssignedList, listBrowsed: resBrowsedList,　scrolled:　(concatList.length > 12)　? true : false };
      }

    }) //and we have to select from units for getting exposedId
    .then((selectResultObj)=>{
      let selectResultList = selectResultObj.listUnread.concat(selectResultObj.listBrowsed);

      return _DB_units.findAll({
        where: {
          id: selectResultList
        }
      })
      .then((resultUnit)=>{ // resultUnit should less than 12 (or 24)
        let resultUnitObj = {};
        let assignedUnits ={
          listUnread: [], listBrowsed: [], scrolled: selectResultObj.scrolled
        };
        resultUnit.forEach((row, index)=>{
          resultUnitObj[row.id] = {
            unitId: row.exposedId,
            assignedInfo: unitsInfo[row.id],
          };
        });
        selectResultObj.listUnread.forEach((unitKey, i) => {
          assignedUnits.listUnread.push(resultUnitObj[unitKey]);
        });
        selectResultObj.listBrowsed.forEach((unitKey, i) => {
          assignedUnits.listBrowsed.push(resultUnitObj[unitKey]);
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
    //these 2 f() are going to keep the parent & self in a list, seperately by belongType, in original instance
    _presv_ParentsByBelong("residence", nodesInfo);
    _presv_ParentsByBelong("homeland", nodesInfo);
    //selectNodesParent()  would return an Obj by 'nodeId' as keys, so simply spread the keys to get the nodes list
    let ancestorKeys = Object.keys(nodesInfo);
    //Object.keys definetely return key in 'string', but id from userResidence/Homeland are 'int'
    //so next step is just a process to unified the item 'type'
    ancestorKeys = ancestorKeys.map((key,index)=>{
      return parseInt(key)
    })
    return ancestorKeys;
  });
  // selecting nodes under belonged nodes as 'children', and! including the same level nodes(children of 'parents')
  let homelandParent = !!userHomeland ? userHomeland['selfInclList'].length > 1 ? [userHomeland['selfInclList'][1]] : [] : [];
  let resiParent = !!userResidence ? userResidence['selfInclList'].length > 1 ? [userResidence['selfInclList'][1]] : [] : [];
  let childrenSelectList = belongList.concat(homelandParent, resiParent);
  let childrenList = await selectNodesChildren(childrenSelectList, 1)
  .then((nodesInfo)=>{
    //selectNodesChildren()  would return an Obj by 'nodeId' as keys, so simply spread the keys to get the nodes list
    let childrenKeys = Object.keys(nodesInfo);
    //Object.keys definetely return key in 'string', but id from userResidence/Homeland are 'int'
    //so next step is just a process to unified the item 'type'
    childrenKeys = childrenKeys.map((key,index)=>{
      return parseInt(key)
    });
    return childrenKeys;
  });
  belongList = belongList.concat(ancestorsList, childrenList);
  // make a list without duplicate
  let filteredList = belongList.filter((nodeId, index)=>{
    return index == belongList.indexOf(nodeId)
  });


  new Promise((resolve, reject)=>{
    _find_assigned_unread( filteredList)
    .then((assignedUnits)=>{
      /*
      assignedUnits was an obj contain {listUnread, listBrowsed, scrolled},
      both list... was an array composed of unit obj contain {unitId, unitsInfo}
      */
      //now we set sendingData
      sendingData.listUnread = assignedUnits.listUnread;
      sendingData.listBrowsed = assignedUnits.listBrowsed;
      sendingData.scrolled = assignedUnits.scrolled;
      // a special situation: if the req was from a reset belong, then we have to free the 'lastVisit' limit
      if(userResidence.createdAt > lastVisit || userHomeland.createdAt > lastVisit){
        // that is, we see all the unit early than lastVisit as new one
        sendingData.listUnread = assignedUnits.listUnread.concat(assignedUnits.listBrowsed);
        sendingData.listBrowsed = [];
      };

      resolve();
    })
    .catch((error)=>{
      reject(new internalError(error ,131));
    })

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
