const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_usersDemandMatch = require('../../../db/models/index').users_demand_match;
const _DB_nodesDemandMatch = require('../../../db/models/index').nodes_demand_match;
const {_res_success} = require('../../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
} = require('../../utils/reserrHandler.js');


function _handle_GET_matchNodes_supply(req, res){
  new Promise((resolve, reject)=>{
    const userId = req.extra.tokenUserId;
    //this api, provide 'menu' currently supplying to the client
    //every node under taken, or every node marks 'supply'
    //And! we would have to rm all the nodes user wished or willing to.

    let selectUserSide = _DB_usersDemandMatch.findOne({
          where: {id_user: userId}}).catch((err)=> {throw err}),
        selectNodeSide = _DB_nodesDemandMatch.findAndCountAll({
          where: {
            [Op.or]: [
              {locked: 1},
              {supply: 1}]
          }}).catch((err)=> {throw err});

    Promise.all([selectUserSide, selectNodeSide])
    .then(([userRow, selectResult])=>{
      let nodeRows = selectResult.rows;
      //and prepare the list we need
      let prevWishedList = JSON.parse(userRow.list_wished),
          prevTakingList = JSON.parse(userRow.taking),
          prevWillingList = JSON.parse(userRow.list_willing);

      let sendingData ={
        nodesList: [],
        temp:{}
      };

      //no matter how many the result is, we just shuffle it to get a random order before the slice pick the number we want
      //random it by 'Fisher-Yates Shuffle'.
      let dealAt = nodeRows.length, tempHolder, randNr;

      while (0 !== dealAt) { //until we go through all list
        randNr = Math.floor(Math.random() * dealAt); //avoid repeatting 'shuffle' the shuffledpart
        dealAt -= 1; //set the index to current one
        //then, shuffle
        tempHolder = nodeRows[dealAt];
        nodeRows[dealAt] = nodeRows[randNr];
        nodeRows[randNr] = tempHolder;
      }
      //now the nodeRows has randomly order. We pick the number we need.
      nodeRows = nodeRows.slice(0, 18); //it would return all items if the length was less
      //then for now, we decide 'not to incl.' the nodes wished or suppy or 'taking' by the user him/her-self
      //which would be no more than 18 as the limit set for the lists.
      let userRegiCorners = prevWishedList.concat(prevTakingList, prevWillingList); //combined the list user records, no need to consider duplicate
      nodeRows.forEach((row, index)=>{
        if(userRegiCorners.indexOf(row.id_node) < 0){
          sendingData.nodesList.push(row.id_node);}
      })

      return sendingData;
    })
    .then((sendingData)=>{
      //resolve if no rejection
      resolve(sendingData);
    }).catch((err)=>{
      reject(new internalError(err, 131));
    });

  }).then((sendingData)=>{
    _res_success(res, sendingData, "Complete, options, GET: /matchNodes/supply.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}


module.exports = _handle_GET_matchNodes_supply;
