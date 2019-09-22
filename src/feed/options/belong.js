const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');
const _DB_sheetsNode = require('../../../db/models/index').sheets_node;
const _DB_users_prefer_nodes = require('../../../db/models/index').users_prefer_nodes;
const {_res_success} = require('../../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
} = require('../../utils/reserrHandler.js');

function _handle_GET_feed_optionsBelong(req, res){
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
      _DB_sheetsNode.findOne({
        where: {id_user: userId}
      }).then((sheetsNodes)=>{
        let checkItems = ['residence', 'hometown', 'stay'];
        let currentRecords = checkItems.map((col, index)=>{
          return sheetsNodes[col]
        });
        mergeList = mergeList.filter((node, index)=>{
          return currentRecords.indexOf(node) < 0;
        });
        return mergeList;
      });
    }).then((mergeList)=>{
      let sendingData={
        nodesList:[],
        temp: {}
      };

      if(mergeList.length < 3){
        return _DB_users_prefer_nodes.findAll({
          limit: 100, //select not more the 100 rows
          order: [['updatedAt', 'DESC']] //select the lstest
        }).then((results)=>{
          let concatList = [];
          results.forEach((row,index)=>{
            concatList.concat(JSON.parse(row.list_shared));
          })
          for()
          
          concatList[Math.floor(Math.random() * concatList.length)]

          concatList.filter((node,index)=>{
            return concatList.indexOf(node) == index;
          })
        })
      }
      else


      resolve(sendingData);
    }).catch((err)=>{
      reject(new internalError(err, 131));
    });


  }).then((sendingData)=>{
    _res_success(res, sendingData, "feed, GET: /options/belong, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

module.exports = _handle_GET_feed_optionsBelong;
