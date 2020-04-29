const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_nouns = require('../../../db/models/index').nouns;
const _DB_usersNodesHomeland = require('../../../db/models/index').users_nodes_homeland;
const _DB_usersNodesResidence = require('../../../db/models/index').users_nodes_residence;
const _DB_lastUpdate_NodeBelongs = require('../../../db/models/index').lastUpdate_nodeBelongs;
const {_res_success} = require('../../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
  forbbidenError
} = require('../../utils/reserrHandler.js');

// notice! cause the var was here, it would definitely be modified(NOT consist) if we do the modification  in the _handler
const categoryAll = ["residence", "homeland"];

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
  .catch((err)=>{
    throw err
  })
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
  .catch((err)=>{
    throw err
  })
};

const _find_fromHomeland_All = (userId)=>{
  return _DB_usersNodesHomeland.findAll({
    where: {
      id_user: userId,
    },
    order: [ //make sure the order of arr are from latest
      Sequelize.literal('`createdAt` DESC') //and here, using 'literal' is due to some wierd behavior of sequelize,
      //it would make an Error if we provide col name by 'arr'
    ]
  })
  .then((result)=>{

    return result;
  })
  .catch((err)=>{
    throw err
  })
};

const _find_fromResidence_All = (userId)=>{
  return _DB_usersNodesResidence.findAll({
    where: { //find the lastest records
      id_user: userId,
    },
    order: [ //make sure the order of arr are from latest
      Sequelize.literal('`createdAt` DESC') //and here, using 'literal' is due to some wierd behavior of sequelize,
      //it would make an Error if we provide col name by 'arr'
    ]
  })
  .then((result)=>{

    return result;
  })
  .catch((err)=>{
    throw err
  })
};
const _update_Homeland_last = (userId) => {
  return _DB_usersNodesHomeland.update(
    { historyify: 1 },
    {
      where: {
        id_user: userId,
        historyify: false
      }
    }
  )
    .then(() => {
      return;
    })
    .catch((err) => {
      throw err
    })
};
const _update_Residence_last = (userId) => {
  return _DB_usersNodesResidence.update(
    { historyify: 1 },
    {
      where: {
        id_user: userId,
        historyify: false
      }
    }
  )
    .then(() => {
      return;
    })
    .catch((err) => {
      throw err
    })
};

async function _create_new(userId, submitObj, category) {
  //create new row after the last one was thorw into history.
  if (category == 'residence') {
    // Update the last records First!!
    await _update_Residence_last(userId);
    await _DB_usersNodesResidence
      .create(submitObj)
      .then(() => {
        return
      })
      .catch((err) => {
        throw err
      });
  } else {
    // Update the last records First!!
    await _update_Homeland_last(userId);
    await _DB_usersNodesHomeland
      .create(submitObj)
      .then(() => {
        return
      })
      .catch((err) => {
        throw err
      });
  }

};


function _handle_GET_profile_nodesBelong(req, res){
  new Promise((resolve, reject)=>{
    let userId = req.extra.tokenUserId; //use userId passed from pass.js
    let category = (!!req.query.category)? req.query.category: false; //query.category could be 'undefined'

    let arrPromiseList = [ //the order has to match the params in the categoryAll
          new Promise((resolve, reject)=>{resolve(_find_fromResidence_last(userId));}),
          new Promise((resolve, reject)=>{resolve(_find_fromHomeland_last(userId));})
        ];
    //all selection would be interate if 'category' was undefined
    if(category){ //so only take the assigned selection if category is 'not' empty
      arrPromiseList = arrPromiseList.filter((selection, index) => {
        return categoryAll[index] == category
      });
    };

    Promise.all(arrPromiseList)
    .then((results)=>{
      let sendingData={
        nodesList: [],
        setCatList: [],
        categoryObj: {},
        temp:{}
      }
      /*
        There is an important assumption: query.category limit in only one category, no category means 'all'.
      */
      results.forEach((singleRec, index)=>{ //singleRec: each return from _last would be a single row from table
        if(!!singleRec){ //in case the result was 'null'
          sendingData.nodesList.push(singleRec.id_node);
          sendingData.setCatList.push(category? category: categoryAll[index]);
          sendingData.categoryObj[category? category: categoryAll[index]] = singleRec.id_node;
        }
      })

      resolve(sendingData);
    }).catch((error)=>{
      reject(new internalError(error ,131));
    })
  }).then((sendingData)=>{
    _res_success(res, sendingData, "profile, GET: /nodesBelong, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}


async function _handle_PATCH_profile_nodesBelong(req, res){
  //claim all repeatedly used var iutside the Promise chain.
  let userId = req.extra.tokenUserId; //use userId passed from pass.js
  let category = req.body.category,
      passedNode = req.body.nodeId;

  //First of all, validating the data passed
  try{
    const passedNodeInfo = await _DB_nouns.findOne({
      where: {
        id: passedNode,
        language: 'en',
        category: 'location_admin'
      }
    });
    if(!passedNodeInfo) throw new forbbidenError("You didn't submit with an allowed nodes.", 120);
    //decided which selection to use depend on the category req passed.
    let selection = (category == 'residence') ? _find_fromResidence_All : _find_fromHomeland_All;

    const allRecs = await selection(userId);
    /*
    There are some limitation to the update to the belong:
    - for Homeland, no more the 3 time
    - for residence, only once per 24 hrs & no more than 5 times in a month.
    - and, residence & homeland could not be the same.

    But, as you will see, now it's just a simple check.
    */
    if(allRecs.length > 1){
      let dateNow = new Date(),
          dateLatest = new Date(allRecs[0].createdAt),
          dateSecond = new Date(allRecs[1].createdAt);
      let nowTime = dateNow.getTime(),
          lastTime = dateLatest.getTime(),
          secondTime = dateSecond.getTime();
      if((nowTime - lastTime) < 300000 && (lastTime - secondTime) < 300000){
        throw new forbbidenError("Is there any difficulty to find a place the most suit you? Perhaps take a while to search a good choice. 'a while' means 5 mins.", 71)
      }
      if (allRecs.length > 10 && (nowTime - lastTime) < 72000000 && (lastTime - secondTime) < 43200000) { //too many time and too frequent, wait 20hrs after a frequency shorter than 12hrs
        throw new forbbidenError("You've change your " + ((category == 'residence') ? 'stay' : 'homeland') + " for too many times. Please find a place most suit you, but change it later.", 71)
      }
      if( category == 'homeland' && allRecs.length > 5 && (nowTime - lastTime) < 518400000 ){ //too many time and too frequent to 'homeland', wait for 6 days
        throw new forbbidenError("You've change your Homeland for too many times. Perhaps spend a weekend to explore your mother land, find your origin, and record the place next week.", 71)
      }
    }

  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return ; //close the process
  }

  new Promise((resolve, reject)=>{

    let submitObj = {
      id_user: userId,
      id_node: passedNode,
    };
    return _create_new(userId, submitObj, category) //create the new records & set last one into history.
    .then(()=>{
      //have to seperate from the last step.
      resolve()

    }).catch((error)=>{
      reject(new internalError(error ,131));
    })
  }).then(()=>{
    //update to the table lastUpdate_nodeBelongs.
    let updateObj = {id_node: passedNode, item: category, id_user: userId, increase: 1}
    let fUpdateNodesBelong = (updateObj) => {
      return _DB_lastUpdate_NodeBelongs.update(
        updateObj,
        {where: {id_node: updateObj.id_node}}
      ).catch((err)=>{throw err});
    };
    /*
    because the table lastUpdate_nodeBelongs was empty at begining, nodes was created one by one 'when' user start to use,
    so we need to check the existence & create the row if the node hasn't been used.
    */
    return _DB_lastUpdate_NodeBelongs.findOrCreate({
      where: {id_node: passedNode},
      defaults: updateObj //create from this time if no record before
    })
    .then(([nodesLastUpdate, created])=>{ //remember to "spread" the result from 'findOrCreate'
      //only 'update' if the row existed
      if(!created) return fUpdateNodesBelong(updateObj)
      else{ return }; //end of 'if()'
    }).then((result)=>{
      return {temp: {}}; //return a plain obj to inform success

    }).catch((error)=>{
      throw new internalError(error ,131);
    });

  }).then((sendingData)=>{
    _res_success(res, sendingData, "profile, PATCH: /nodesBelong, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('profile, GET: /nodesBelong ');
  _handle_GET_profile_nodesBelong(req, res);
});

execute.patch('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('profile, PATCH: /nodesBelong ');
  _handle_PATCH_profile_nodesBelong(req, res);
});

module.exports = execute;
