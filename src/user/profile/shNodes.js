const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');
const _DB_sheetsNode = require('../../../db/models/index').sheets_node;
const _DB_usersCustomIndex = require('../../../db/models/index').users_custom_index;
const {_res_success} = require('../../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
} = require('../../utils/reserrHandler.js');

function _handle_GET_profile_sheetsNodes(req, res){
  new Promise((resolve, reject)=>{
    let userId = req.extra.tokenUserId; //use userId passed from pass.js

    const selectPresent = ()=>{
      let checkItems = ['residence', 'hometown', 'stay']; //prepared to used after selection from DB

      return _DB_sheetsNode.findOne({
        where: {id_user: userId}
      }).then((row)=>{
        let sendingData={
          nodesList:[],
          nodesChart:{},
          temp: {}
        };

        //there are 2 posibilities: already record, or not.
        if(row != null){
          //then, we only select items describe present state
          for(let i = 0 ; i < checkItems.length; i++){
            if(row[checkItems[i]] != null){
              sendingData.nodesList.push(row[checkItems[i]])
              sendingData.nodesChart[row[checkItems[i]]] = checkItems[i];
            };
          }
        }

        //limit?
        //in the future, if the selecting items increase, we need to check the limit in case we send 'too many' nodes

        resolve(sendingData);
      }).catch((err)=>{
        reject(new internalError(err, 131));
      });
    };

    //check the range of req, including present and entire
    //entire hasn't established, should be done when the req come from profile page
    if('present' in req.query){
      selectPresent();
    }else{
      resolve({temp:{}});
    }

  }).then((sendingData)=>{
    _res_success(res, sendingData, "profile, GET: /sheetsNodes, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

function _handle_PATCH_profile_sheetsNodes(req, res){
  const mutableCols =  ['residence', 'hometown', 'stay'];

  new Promise((resolve, reject)=>{
    let userId = req.extra.tokenUserId; //use userId passed from pass.js

    //update the submit data directly into table sheets_node

    //first, we don't know how many property were submitted,
    //so loop them to est a bool list by mutable columns list
    let colsList = mutableCols.map((col,index)=>{
      return (col in req.body.belong) ? true: false;
    })

    //then find the current records
    _DB_sheetsNode.findOne({
      where:{id_user: userId}
    }).then((preference)=>{
      let newSheetsRow = {},
          newBelongArr = []; //used for record update to custom_index, we updating no matter there is any diff
      //check current data, if a new submit need to override the current, we move the current to history
      if(colsList[0] && !!preference[mutableCols[0]]){ //if there is a records in 'residence' in table and not null
        let prevRecord = JSON.parse(preference.residence_history);
        prevRecord.push(preference.residence); //push first! insert the old record
        //then put it into the new obj
        newSheetsRow['residence_history'] = JSON.stringify(prevRecord);
      }
      if(colsList[2] && !!preference[mutableCols[2]]){
        let prevRecord = JSON.parse(preference.stay_history);
        prevRecord.push(preference.stay); //push first! insert the old record
        newSheetsRow['stay_history'] = JSON.stringify(prevRecord);
      }
      //then insert new data into newSheetsRow depend on former est. bool list
      colsList.forEach((bool,index)=>{
        let col = mutableCols[index];
        if(bool){
          newSheetsRow[col] = req.body.belong[col];
          newBelongArr.push(Number(req.body.belong[col])); //for update to custom_index, keep it follow the latest client thought
          //here, need to parse the 'string' passed from request.body into num (it should be a ID/integer represent a node)
        }
        else{ if(!!preference[col] ) newBelongArr.push(preference[col]); //for update to custom_index, still compose as previous
        };
      });

      resolve({newSheetsRow: newSheetsRow, newBelongValue: {currentbelong: JSON.stringify(newBelongArr)}});
    }).catch((error)=>{
      reject(new internalError(error ,131));
    })
  }).then((valueObj)=>{
    //Update all in this block.

    //claim userId again because we have already left the last promise
    let userId = req.extra.tokenUserId; //use userId passed from pass.js
    let pUpdateSheetsNode = _DB_sheetsNode.update(
          valueObj.newSheetsRow,
          {
            where: {id_user: userId},
            fields: ['residence', 'hometown', 'stay', 'residence_history', 'stay_history'] //limit the mutable columns, in case the intentional error
          }
        ).catch((err)=>{throw err}),
        pUpdateCustomIndex = _DB_usersCustomIndex.update(
          valueObj.newBelongValue,
          {
            where: {id_user: userId},
            fields: ['currentbelong'] //limit the mutable columns, in case the intentional error
          }
        ).catch((err)=>{throw err});
    return Promise.all([
      pUpdateSheetsNode,
      pUpdateCustomIndex
    ]).then((result)=>{
      return {temp: {}}; //return a plain obj to inform success
    }).catch((error)=>{
      throw new internalError(error ,131);
    })

  }).then((sendingData)=>{
    _res_success(res, sendingData, "profile, PATCH: /sheetsNodes, complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('profile, GET: /sheetsNodes ');
  _handle_GET_profile_sheetsNodes(req, res);
});
execute.patch('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('profile, PATCH: /sheetsNodes ');
  _handle_PATCH_profile_sheetsNodes(req, res);
});

module.exports = execute;
