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
    const reqToken = req.body.token || req.headers['token'] || req.query.token;
    const jwtVerified = jwt.verify(reqToken, verify_key);
    if (!jwtVerified) rejectTop(new internalError(jwtVerified, 32));

    const userId = jwtVerified.user_Id;

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
        }).then(function(modifiedBody){
          //this block, dealing with nouns(nodes) it tagged

          return new Promise((resolve, reject)=>{
            let valuesArr = [],
                promiseArr= [];
            //check if the noun exist! in case some people use faked nound id,
            //and prepared to insert into attribution
            modifiedBody.nouns.list.forEach(function(nounKey, index){
              let checkReq = Promise.resolve(
                _DB_nouns.findByPk(nounKey).then(noun=>{ // actually, we should use findall.() to reduce processing time
                  if(!noun) return; //no this noun exist, it's a faked id, sojust go for next
                  let nounBasic = modifiedBody.nouns.basic[nounKey];
                  valuesArr.push([
                    nounBasic.id,
                    modifiedBody.id_unit,
                    userId
                  ]);
                })
              )
              promiseArr.push(checkReq);
            });
            //if we use findall(), we don't need to use Promise.all
            Promise.all(promiseArr).then(()=>{
              if(valuesArr.length<1) throw new forbbidenError({"warning": "you've passed an invalid nouns key"}, 120);
              connection.query('INSERT INTO attribution (id_noun, id_unit, id_author) VALUES ?', [valuesArr], function(err, rows, fields) {
                if (err) {reject(err);return;}
                console.log('database connection: success.')
                resolve(modifiedBody)
              })
            })
          })
        }).then((modifiedBody)=>{
          //this block, final, dealing with the rest
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

          let promiseArr = [
            Promise.resolve(_reachCreate(modifiedBody.id_unit, userId)).catch((err)=>{throw err}), //currently, reachCreate is 'not' a promise, so it is useless to wrap it in .resolve()
            Promise.resolve(dbSelectUpdate_Preference()).catch((err)=>{throw err})
          ];
          return Promise.all(promiseArr).then((results)=>{
            return modifiedBody;
          });
        }).then((modifiedBody)=>{
          _res_success_201(res, {unitId: modifiedBody.id_unit});

          connection.release();
          resolveTop(); //should remove after the error could handle by top promise
        }).catch((err)=>{
          console.log("error occured during newShare promise: "+err)
          _handler_err_Internal(err, res);
          connection.release();

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
