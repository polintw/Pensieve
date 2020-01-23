const express = require('express');
const execute = express.Router();

const fs = require('fs');
const path = require("path");
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../../config/jwt.js');
const {connection_key} = require('../../../config/database.js');
const winston = require('../../../config/winston.js');
const {
  userImg_SecondtoSrc
} = require('../../../config/path.js');

const _DB_nouns = require('../../../db/models/index').nouns;
const _DB_attribution = require('../../../db/models/index').attribution;
const _DB_nodes_activity = require('../../../db/models/index').nodes_activity;
const _DB_nodesDemandMatch = require('../../../db/models/index').nodes_demand_match;
const _DB_usersDemandMatch = require('../../../db/models/index').users_demand_match;
const _DB_users_prefer_nodes = require('../../../db/models/index').users_prefer_nodes;
const {
  _handler_err_Internal,
  _handle_ErrCatched,
  forbbidenError,
  notAcceptable
} = require('../../utils/reserrHandler.js');
const {
  _res_success_201
} = require('../../utils/resHandler.js');
const {
  _reachCreate
} = require('./src.js');

const database = mysql.createPool(connection_key);

function shareHandler_POST(req, res){
  new Promise((resolveTop, rejectTop)=>{

    let userId = req.extra.tokenUserId; //use userId passed from pass.js

    //beneath, is part that inherit from an ancient version
    //still need to update for a better maintainance
    database.getConnection(function(err, connection){
      if (err) {
        _handler_err_Internal(err, res);
        console.log("error occured when getConnection in newShare handle.")
        resolveTop(); //should remove after the error could handle by top promise
      }else{
        new Promise((resolve, reject)=>{
          //add it into shares as a obj value
          console.log('add new one: deal img.');
          let modifiedBody = new Object();
          let coverBase64Buffer ,beneathBase64Buffer;
          //deal with cover img first.
          let coverBase64Splice = req.body.coverBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
          coverBase64Buffer = new Buffer(coverBase64Splice[2], 'base64');
          //then deal with beneath img if any.
          if(req.body.beneathBase64){
            let beneathBase64Splice = req.body.beneathBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
            beneathBase64Buffer = new Buffer(beneathBase64Splice[2], 'base64');
          }
          fs.writeFile(path.join(__dirname, userImg_SecondtoSrc+userId+'/'+req.body.submitTime+"_layer_0.jpg"), coverBase64Buffer, function(err){
            if(err) {reject(err);return;}
            modifiedBody['url_pic_layer0'] = userId+'/'+req.body.submitTime+'_layer_0.jpg';
            if(req.body.beneathBase64){
              fs.writeFile(path.join(__dirname, userImg_SecondtoSrc+userId+'/'+req.body.submitTime+"_layer_1.jpg"), beneathBase64Buffer, function(err){
                if(err) {reject(err);return;}
                modifiedBody['url_pic_layer1'] = userId+'/'+req.body.submitTime+'_layer_1.jpg';
                resolve(modifiedBody);
              });
            }else{
              resolve(modifiedBody);
            }
          });
        }).then((modifiedBody)=>{
          Object.assign(modifiedBody, req.body);
          delete modifiedBody.coverBase64;
          delete modifiedBody.beneathBase64;
          return(modifiedBody);
        }).then(function(modifiedBody){
          //first, write into the table: units
          //and get the id_unit here first time
          return new Promise((resolve, reject)=>{
            let unitProfile = {
              'id_author': userId,
              'url_pic_layer0': modifiedBody.url_pic_layer0,
              'url_pic_layer1': modifiedBody.url_pic_layer1,
              'id_primer': req.query.primer?req.query.primer:null
            }
            connection.query('INSERT INTO units SET ?', unitProfile, function(err, result, fields) {
              if (err) {reject(err);return;}
              console.log('database connection: success.')
              modifiedBody['id_unit'] = result.insertId;
              resolve(modifiedBody)
            })
          })
        }).then(function(modifiedBody){
          //this block, write into the table: marks
          return new Promise((resolve, reject)=>{
            let valuesArr = modifiedBody.joinedMarksList.map(function(markKey, index){
              let markObj = modifiedBody.joinedMarks[markKey];
              let editorString = JSON.stringify(markObj.editorContent); //notice, same part in the req.body would also be transformed

              return [
                modifiedBody.id_unit,
                userId,
                markObj.layer,
                markObj.top,
                markObj.left,
                markObj.serial,
                editorString
              ]
            })
            connection.query('INSERT INTO marks (id_unit, id_author, layer,portion_top,portion_left,serial,editor_content) VALUES ?; SHOW WARNINGS;', [valuesArr], function(err, result, fields) {
              if (err) {reject(err);return;}
              console.log('database connection: success.')
              resolve(modifiedBody)
            })
          })
        }).then((modifiedBody)=>{
          //this block, dealing with nouns(nodes) it tagged.
          //But before create record to attribution,
          //check if the noun exist! in case some people use faked nound id,
          //and prepared to insert into attribution
          return _DB_nouns.findAll({
            where: {id: modifiedBody.nouns.list}
          }).then(results => {
            //if there is no validate noun passed from client,
            //cancel by reject to the Top level
            //& warn the client
            if(results.length<1) rejectTop(new forbbidenError({"warning": "you've passed an invalid nouns key"}, 120));

            modifiedBody.nouns.list = []; //clear the old record, preparing to accept new, confirmed list
            //make nodes array by rows
            let nodesArr = results.map((row, index)=>{
              modifiedBody.nouns.list.push(row.id); //the list would still be used at process after here, like backend process
              return ({
                id_noun: row.id,
                id_unit: modifiedBody.id_unit,
                id_author: userId
              })
            });
            //then create into table attribution
            return _DB_attribution.bulkCreate(nodesArr, {fields: ['id_unit', 'id_author', 'id_noun']});
          }).then(()=>{
            //at the end of this serires, still return the whole modifiedBody to the next process
            return modifiedBody;
          })

        }).then((modifiedBody)=>{
          //every essential step for a shared has been done
          //return success & id just created
          _res_success_201(res, {unitId: modifiedBody.id_unit});

          connection.release();
          //resolve, and return the modifiedBody for backend process
          return(modifiedBody);

        }).catch((err)=>{
          console.log("error occured during newShare promise: "+err)
          _handler_err_Internal(err, res);
          connection.release();

          resolveTop(); //should remove after the error could handle by top promise
        }).then((modifiedBody)=>{
          //backend process
          //no connection should be used during this process
          //because we are still under the transition structure(part old),
          //pay attention that could not use the 'rejectTop' which would try to connect client.
          //const userId = req.extra.tokenUserId; //use userId passed from pass.js
          //reclaim again because this part should be independent from the previous in the future,
          //in that case the variants would lost
          const dbSelectUpdate_Preference = ()=> {
            return _DB_users_prefer_nodes.findOne({
              where:{id_user: userId}
            }).then((preference)=>{
              let prevList = JSON.parse(preference.list_shared);
              let concatList = prevList.concat(modifiedBody.nouns.list);
              //concatList should be a new est. array now, no connection to the original preference
              const mergeList = concatList.filter((node, index)=>{
                //use the property of indexOf: only return the index of first one
                //to let every node iterate only once
                return concatList.indexOf(node) == index;
              });
              //then insert the new records back to table
              return _DB_users_prefer_nodes.update(
                {list_shared: JSON.stringify(mergeList)},  //Important! and remember turn the array into string before update
                {where: {id_user: userId}}
              );
            })
          };
          const dbSelectUpdate_NodeActivity = () => {
            return _DB_nodes_activity.findAll({
              where: {id_node: modifiedBody.nouns.list}
            }).then((nodesActivity)=>{
              //if the node was new used, it won't has record from nodesActivity
              //so let's compare the selection and the list in modifiedBody
              //first, copy a new array, prevent modification to modifiedBody
              let nodesList = modifiedBody.nouns.list.slice();
              //second, make a list reveal record in nodesActivity
              let activityList = nodesActivity.map((row,index)=>{ return row.id_node;});
              let newList = [];
              //then, check id in list, skip the node already exist in nodesActivity
              nodesList.forEach((nodeId, index)=>{
                if(activityList.indexOf(nodeId) > (-1)) return;
                newList.push({
                  id_node: nodeId,
                  status: 'online',
                  id_firstUnit: modifiedBody.id_unit
                });
              });
              //final, insert to table if there is any new used node.
              if(newList.length > 0){
                return _DB_nodes_activity.bulkCreate(newList);
              }
            })
          };

          async function checkingTakingNode(){
            let userRow = await _DB_usersDemandMatch.findOne({
              where: {id_user: userId}
            });

            if(!userRow.occupied) return; //use 'occupied' to determine if the user was taking any node.

            let takenNodes = JSON.parse(userRow.taking); //actually, there would be only one node recorded in the list.
            let indexInShared = modifiedBody.nouns.list.indexOf(takenNodes[0]);

            if(indexInShared < 0) return; //jump out if the new shared do not match the node taken
            //then we now at taken node was realize, we now going to modified taking status, and then rm user from list.
            let nodeRow = await _DB_nodesDemandMatch.findOne({
              where: {id_node: takenNodes[0]}
            });
            let prevTakingUsers = JSON.parse(nodeRow.list_taking);
            let newTakingUser = prevTakingUsers.slice();
            let indexInTaking = prevTakingUsers.indexOf(userId);
            if(indexInTaking >(-1)) newTakingUser.splice(indexInTaking, 1); //in case somehow the user is not on the list

            let updateUser = { //obj for user match
                  occupied: 0,
                  taking: '[]'
                },
                updateNode = {
                  locked: 0,
                  finished: modifiedBody.id_unit,
                  supply: 0,
                  list_waiting: '[]',
                  list_taking: JSON.stringify(newTakingUser)
                };

            await _DB_usersDemandMatch.update(
              updateUser,
              {where: {id_user: userId}}
            ); //sequelize.update() would not return anything (as I know)

            await _DB_nodesDemandMatch.update(
              updateNode,
              {where: {id_node: takenNodes[0]}}
            ); //sequelize.update() would not return anything (as I know)
          }

          let promiseArr = [
            Promise.resolve(_reachCreate(modifiedBody.id_unit, userId)).catch((err)=>{throw err}), //currently, reachCreate is 'not' a promise, so it is useless to wrap it in .resolve()
            //_reachCreate sould better be put in front process, as an opinion after finding the error here would cause undefined display of related records on client side
            Promise.resolve(dbSelectUpdate_Preference()).catch((err)=>{throw err}),
            Promise.resolve(dbSelectUpdate_NodeActivity()).catch((err)=>{throw err}),
            Promise.resolve(checkingTakingNode()).catch((err)=>{throw err})
          ];
          return Promise.all(promiseArr).then((results)=>{
            resolveTop(); //should remove after the error could handle by top promise
          });

        }).catch((error)=>{
          //the backend process has its own error catch,
          //different from the previous process
          winston.error(`${"Internal process "} , ${"for "+"shareHandler_POST: "}, ${error}`);

          resolveTop(); //should remove after the error could handle by top promise
        });
      }
    })
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

execute.post('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('POST: /share');
  shareHandler_POST(req, res);
})

module.exports = execute
