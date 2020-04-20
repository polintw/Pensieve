const express = require('express');
const execute = express.Router();
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


const _find_fromHomeland_AllFellows = (nodeId)=>{
  return _DB_usersNodesHomeland.findAll({
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
const _find_fromResidence_AllFellows = (nodeId)=>{
  return _DB_usersNodesResidence.findAll({
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

const _find_fromHomeland_Condition = (usersArr)=>{
  return _DB_usersNodesHomeland.findAll({
    where: {
      id_user: usersArr, //an IN query
      historyify: false
    },
    attributes: [
      //'max' here combined with 'group' prop beneath,
      //because the GROUP by would fail when the 'createdAt' is different between each row,
      //so we ask only the 'max' one by this method
      [Sequelize.fn('max', Sequelize.col('createdAt')), 'createdAt'], //fn(function, col, alias)
      'id_node', //set attributes, so we also need to call every col we need
    ],
    group: 'id_node' //Important. means we combined the rows by node, each id_node would only has one row
  })
  .then((result)=>{
    return result;
  })
  .catch((err)=>{ throw err })
};
const _find_fromResidence_Condition = (usersArr)=>{
  return _DB_usersNodesResidence.findAll({
    where: {
      id_user: usersArr, //an IN query
      historyify: false
    },
    attributes: [
      //'max' here combined with 'group' prop beneath,
      //because the GROUP by would fail when the 'createdAt' is different between each row,
      //so we ask only the 'max' one by this method
      [Sequelize.fn('max', Sequelize.col('createdAt')), 'createdAt'], //fn(function, col, alias)
      'id_node', //set attributes, so we also need to call every col we need
    ],
    group: 'id_node' //Important. means we combined the rows by node, each id_node would only has one row
  })
  .then((result)=>{
    return result;
  })
  .catch((err)=>{ throw err })
};


function _handle_GET_feedFellows(req, res){
  new Promise((resolve, reject)=>{
    const userId = req.extra.tokenUserId;

    const baseNode = !!req.query.base? req.query.base: null ; //nodeId, set 'null' to avoid empty query(would res empty arr)
    const baseCat = req.query.baseCat; //cat str
    const curiousCat = req.query.curious; //[]
    const limit = !!req.query.limit ? req.query.limit: false;

    const selectionChart = {
      homeland: _find_fromHomeland_AllFellows,
      residence: _find_fromResidence_AllFellows
    };
    const conditionSelectionChart = {
      homeland: _find_fromHomeland_Condition,
      residence: _find_fromResidence_Condition
    };
    /*
      Is it possible we use JOIN here ?
      select only once by combining tables.
    */
    let selection = selectionChart[baseCat];

    selection(baseNode)
    .then((selectResult)=>{
      let usersArr = selectResult.map((row, index)=>{
        return row.id_user;
      });
      let curiousSelect = conditionSelectionChart[curiousCat];

      return curiousSelect(usersArr).catch((err)=>{ throw err});
    })
    .then((result)=>{
      let sendingData={
        nodesList: [],
        temp:{}
      }
      //result was an array of instance of rows of a node
      sendingData.nodesList = result.map((row, index)=>{
        return row.id_node
      });

      resolve(sendingData);
    }).catch((error)=>{
      reject(new internalError(error ,131));
    })
  }).then((sendingData)=>{
    _res_success(res, sendingData, "GET: user feed/fellows, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: user feed/fellows.');
  _handle_GET_feedFellows(req, res);
})

module.exports = execute;
