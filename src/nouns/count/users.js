const winston = require('../../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_usersNodesHomeland = require('../../../db/models/index').users_nodes_homeland;
const _DB_usersNodesResidence = require('../../../db/models/index').users_nodes_residence;
const {_res_success} = require('../../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
  forbbidenError
} = require('../../utils/reserrHandler.js');

const _findandcount_fromHomeland_All = (nodeId)=>{
  return _DB_usersNodesHomeland.findAndCountAll({
    where: {
      id_node: nodeId,
      historyify: false
    },
  })
  .then((result)=>{
    return result;
  })
  .catch((err)=>{ throw err })
};
const _findandcount_fromResidence_All = (nodeId)=>{
  return _DB_usersNodesResidence.findAndCountAll({
    where: {
      id_node: nodeId,
      historyify: false
    },
  })
  .then((result)=>{
    return result;
  })
  .catch((err)=>{ throw err })
};

/*
Beneath are part counting users by the users list selected from 'another' table
But! They are only part of a temporary method for the dirty prototype,
should be reconsider in a former production!
*/
const _findandcount_currentResiFromLimit_byUsers = (usersArr, nodeLimit)=>{
  return _DB_usersNodesHomeland.findAndCountAll({
    where: {
      id_user: usersArr, //an IN query by users array
      id_node: nodeLimit,
      historyify: false
    }
  })
  .then((result)=>{
    return result;
  })
  .catch((err)=>{ throw err })
};
const _findandcount_fromHomeAtLimit_byUsers = (usersArr, nodeLimit)=>{
  return _DB_usersNodesResidence.findAndCountAll({
    where: {
      id_user: usersArr, //an IN query by users array
      id_node: nodeLimit,
      historyify: false
    }
  })
  .then((result)=>{
    return result;
  })
  .catch((err)=>{ throw err })
};

function _handle_GET_nounCount_users(req, res){
  new Promise((resolve, reject)=>{
    const userId = req.extra.tokenUserId;
    const baseNode = req.reqNounId;
    const categoryAll = ["residence", "homeland"]; //remember put this var inside _handler, otherwise it would be modified once a req came in!
    const arrSelectionList = [ //the order has to match the params in the categoryAll
      new Promise((resolve, reject)=>{resolve(_findandcount_fromResidence_All(baseNode));}),
      new Promise((resolve, reject)=>{resolve(_findandcount_fromHomeland_All(baseNode));})
    ];

    const limitCorner = !!req.query.limitCorner ? req.query.limitCorner: false; // 'str' if true
    const countCat = !!req.query.countCat ? req.query.countCat: false; // [] if true

    let processedCat = categoryAll; //the categoryAll would still be modified by f() later??
    let arrPromiseList = arrSelectionList;

    if(countCat) {
      //'delete': rm the category & repectively promise not in the countCat
      arrSelectionList.forEach((p, index) => {
        if(countCat.indexOf(categoryAll[index]) <0){
          arrPromiseList.splice(index, 1);
          processedCat.splice(index, 1);
        }
      });
    };

    //condition limitCorner, but actually should not be put here and processed like this
    if(limitCorner) {
      /*
        Actually, we should use a selection with 'JOIN' if there were any limitCorner.
        Have to: add join param into selection, let the selection use the parmas obj passed.
        Rm the second selection beneath if the new method was est.
      */
      /*
        And we all assume now that the limitCorner contain only one node,
        "countCat" array only 1 catagory as well!
      */

      //find all users base on baseNode
      let _find_fromHomeland_outUsers = (nodeId)=>{
        return _DB_usersNodesHomeland.findAll({
          where: {id_node: nodeId, historyify: false}
        })
        .then((result)=>{
          let usersArr = result.map((row, index)=>{
            return row.id_user
          });
          return usersArr;
        })
        .catch((err)=>{ throw err })
      };
      let _find_fromResidence_outUsers = (nodeId)=>{
        return _DB_usersNodesResidence.findAll({
          where: {id_node: nodeId, historyify: false}
        })
        .then((result)=>{
          let usersArr = result.map((row, index)=>{
            return row.id_user
          });
          return usersArr;
        })
        .catch((err)=>{ throw err })
      };
      // get the users
      let usersSelection = (countCat[0]=="homeland") ? _find_fromHomeland_outUsers : _find_fromResidence_outUsers;
      let limitSelection = (countCat[0]=="homeland") ? _findandcount_fromHomeAtLimit_byUsers: _findandcount_currentResiFromLimit_byUsers;
      async function asyncUsersArr(nodeId){
        let usersArr = await usersSelection(nodeId);
        return usersArr;
      }

      arrPromiseList = [
        new Promise((resolve, reject)=>{
          asyncUsersArr(baseNode)
          .then((usersArr)=>{
            resolve(limitSelection(usersArr, limitCorner))
          })
        })
      ]
    };


    Promise.all(arrPromiseList)
    .then((results)=>{
      let sendingData={
        countsByTypes: {},
        temp:{}
      }
      //remember we using the 'findAndCountAll'
      if(countCat){ //not 'all' situation, have to separate.
        processedCat.forEach((category, index) => {
          sendingData.countsByTypes[category] = results[index].count
        });
      }
      else{ // every category were included, no need to separate.
        let countTotal = 0;
        for(let i=0; i< results.length; i++){
          countTotal += results[i].count;
        }
        sendingData.countsByTypes["all"] = countTotal;
      }


      resolve(sendingData);
    }).catch((error)=>{
      reject(new internalError(error ,131));
    })
  }).then((sendingData)=>{
    _res_success(res, sendingData, "GET: /nouns/:id/count, users, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

module.exports = {
  _handle_GET_nounCount_users
};
