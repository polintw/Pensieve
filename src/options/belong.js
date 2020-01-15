const express = require('express');
const execute = express.Router();
const winston = require('../../config/winston.js');
const _DB_sheetsNode = require('../../db/models/index').sheets_node;
const _DB_users_prefer_nodes = require('../../db/models/index').users_prefer_nodes;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
} = require('../utils/reserrHandler.js');

function _handle_GET_options_Belong(req, res){
  new Promise((resolve, reject)=>{
    let userId = req.extra.tokenUserId; //use userId passed from pass.js

    //first should select from sheets, but due to the table nouns could not recognize parent & children now,
    //for now we first select from nodes preference, both shared & inspired, mix and random push
    //remove the repeat one already records in sheets_node
    //if less than 3, select from the others records of shared prefer

    _DB_users_prefer_nodes.findOne({
      where:{id_user: userId}
    }).then((preference)=>{
      //retrieve records of list_shared / _inspired
      //mix the list, & choose three randomly
      let listShared = JSON.parse(preference.list_shared),
          listInspired = JSON.parse(preference.list_inspired);
      let concatList = listShared.concat(listInspired);
      const mergeList = concatList.filter((node, index)=>{
        //use the property of indexOf: only return the index of first one
        //to let every node iterate only once
        return concatList.indexOf(node) == index;
      });

      return mergeList;

    }).then((mergeList)=>{
      //to move nodes already in sheets records
      return _DB_sheetsNode.findOne({
        where: {id_user: userId}
      }).then((sheetsNodes)=>{
        let checkItems = ['residence', 'hometown', 'stay'];
        let currentRecords = checkItems.map((col, index)=>{
          return sheetsNodes[col]
        }); //we use only 3 of the columns
        mergeList = mergeList.filter((node, index)=>{
          return currentRecords.indexOf(node) < 0; //would not include node already in currentRecords
        });
        return mergeList;
      });
    }).then((mergeList)=>{
      let sendingData={
        nodesList:[],
        temp: {}
      };
      //still possible the user do not have enough records in preference
      //so we use popular nodes among Shared instead
      if(mergeList.length < 5){
        //return the whole promise directly to higher
        //return a final sendingData at the env of process
        return _DB_users_prefer_nodes.findAll({
          limit: 100, //select not more the 100 rows
          order: [['updatedAt', 'DESC']] //select the lstest
        }).then((results)=>{
          let concatList = [];
          results.forEach((row,index)=>{
            concatList = concatList.concat(JSON.parse(row.list_shared));
          })

          for(let i=1; i >0 ; i++){ //Important!! this is a Infinite Loop, but we do it in purpose!
            //because we don'y know how many loop will need to fullfill the requirement
            //so make sure 'break' the loop from inside, jump out the infinity
            let randomNode = concatList[Math.floor(Math.random() * concatList.length)] //select node id from concatList randomly
            if(mergeList.indexOf(randomNode)< 0) mergeList.push(randomNode); //abandon repreat pick
            if(mergeList.length> 4) break; //Important to jump out! we make a list just include 5 items
          }

          sendingData.nodesList = mergeList;

          resolve(sendingData);
        })
      }
      else{ //mergeList has enough choice
        //remember there is no duplicate node in mergeList,
        //but on the contrast, we need to 'remove' chosen node each time from mergeList
        //during the process to assure it would not repeat due to the same random number
        for(let i=0; i<5 ; i++ ){
          const randomInt = Math.floor(Math.random() * mergeList.length); // make sure use 'const',
          //because we are not sure the order of each line  in js
          //we have to make sure the randomInt would not change because we modified the mergeList length at following line
          sendingData.nodesList.push(mergeList[randomInt]);
          mergeList.splice(randomInt, 1);
        }

        resolve(sendingData);
      };

    }).catch((err)=>{
      reject(new internalError(err, 131));
    });


  }).then((sendingData)=>{
    _res_success(res, sendingData, "options, GET: /belong, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

execute.get('/belong', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('options, GET: /belong ');
  _handle_GET_feed_optionsBelong(req, res);
})


module.exports = execute;
