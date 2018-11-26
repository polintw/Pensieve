const fs = require('fs');
const path = require("path");
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const {verify_key} = require('../../../config/jwt.js');
const {connection_key} = require('../../../config/database.js');
const {_handler_err_BadReq, _handler_err_Unauthorized, _handler_err_Internal} = require('../../utils/reserrHandler.js');

const database = mysql.createPool(connection_key);

function shareHandler_POST(req, res){
  jwt.verify(req.headers['token'], verify_key, function(err, payload) {
    if (err) {
      _handler_err_Unauthorized(err, res)
    } else {
      let userId = payload.user_Id;
      let requesterId = req.requesterId;
      database.getConnection(function(err, connection){
        if (err) {
          _handler_err_Internal(err, res);
          console.log("error occured when getConnection in newShare handle.")
        }else{
          new Promise((resolve, reject)=>{
            //temp method, waiting for a real Pics server
            let imgFolderPath = path.join(__dirname, '/../../..', '/dev/faked_Pics/'+userId);
            fs.access(imgFolderPath, (err)=>{
              if(err){
                //which mean the folder doesn't exist
                fs.mkdir(imgFolderPath, function(err){
                  if(err) {reject(err);}
                  resolve();
                })
              }
              //or without err
              resolve();
            })
          }).then(function() {
            return new Promise((resolve, reject)=>{
              //add it into shares as a obj value
              console.log('add new one: deal img.');
              let modifiedBody = new Object();
              //deal with cover img first.
              let coverBase64Splice = req.body.coverBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
              let coverBase64Buffer = new Buffer(coverBase64Splice[2], 'base64');
              fs.writeFile(path.join(__dirname, '/../../..', '/dev/faked_Pics/'+userId+'/'+req.body.submitTime+"_layer_0.jpg"), coverBase64Buffer, function(err){
                if(err) {reject(err);}
              });
              modifiedBody['url_pic_layer0'] = userId+'/'+req.body.submitTime+'_layer_0.jpg';
              //then deal with beneath img if any.
              if(req.body.beneathBase64){
                let beneathBase64Splice = req.body.beneathBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
                let beneathBase64Buffer = new Buffer(beneathBase64Splice[2], 'base64');
                modifiedBody['url_pic_layer1'] = userId+'/'+req.body.submitTime+'_layer_1.jpg';
                fs.writeFile(path.join(__dirname, '/../../..', '/dev/faked_Pics/'+userId+'/'+req.body.submitTime+"_layer_1.jpg"), beneathBase64Buffer, function(err){
                  if(err) {reject(err);}
                });
              }

              Object.assign(modifiedBody, req.body);
              delete modifiedBody.coverBase64;
              delete modifiedBody.beneathBase64;

              resolve(modifiedBody)
            })
          }).then(function(modifiedBody){
            console.log('add new one, write into the table: units.');
            return new Promise((resolve, reject)=>{
              let unitProfile = {
                'id_author': userId,
                'url_pic_layer0': modifiedBody.url_pic_layer0,
                'url_pic_layer1': modifiedBody.url_pic_layer1,
                'id_primer': req.query.primer?req.query.primer:null
              }
              connection.query('INSERT INTO units SET ?', unitProfile, function(err, result, fields) {
                if (err) {reject(err);}
                console.log('database connection: success.')
                modifiedBody['id_unit'] = result.insertId;
                resolve(modifiedBody)
              })
            })
          }).then(function(modifiedBody){
            console.log('add new one, write into the table: marks.');
            return new Promise((resolve, reject)=>{
              let valuesArr = modifiedBody.joinedMarks.map(function(markObj, index){
                return [
                  modifiedBody.id_unit,
                  userId,
                  markObj.layer,
                  markObj.top,
                  markObj.left,
                  markObj.serial,
                  markObj.editorContent
                ]
              })
              connection.query('INSERT INTO marks (id_unit, id_author, layer,portion_top,portion_left,serial,editor_content) VALUES ?; SHOW WARNINGS;', [valuesArr], function(err, result, fields) {
                if (err) {reject(err);}
                console.log('database connection: success.')
                resolve(modifiedBody)
              })
            })
          }).then(function(modifiedBody){
            console.log('add new one, write into the table: attribution.');
            let _db_createNoun = (resolve, reject, newNounskey)=>{
              let valuesArr = newNounskey.map((nounKey, index)=>{
                return [modifiedBody.nouns.basic[nounKey].name]
              })
              connection.query('INSERT INTO nouns (name) VALUES ?', [valuesArr], function(err, results, fields) {
                if (err) {reject(err);}
                console.log('database connection: success.')
                for(let i=0; i< results.affectedRows ; i++){
                  // ! should have extra confirmation for continuity!
                  modifiedBody.nouns.basic[newNounskey[i]]["id"] = results.insertId+i;
                }
                resolve(modifiedBody)
              })
            };// Should consider isolate this part, create a new noun, to a independent api!!

            let _db_addAttribution = (resolve, reject)=>{
              let valuesArr = modifiedBody.nouns.list.map(function(nounKey, index){
                let nounBasic = modifiedBody.nouns.basic[nounKey];
                return [
                  nounBasic.id,
                  modifiedBody.id_unit,
                  userId
                ]
              })
              connection.query('INSERT INTO attribution (id_noun, id_unit, id_author) VALUES ?', [valuesArr], function(err, rows, fields) {
                if (err) {reject(err);}
                console.log('database connection: success.')
                resolve(modifiedBody)
              })
            };
            return new Promise((resolve, reject)=>{
              let newNounskey = [];
              modifiedBody.nouns.list.forEach((nounId, index)=>{
                if(!modifiedBody.nouns.basic[nounId].ify){
                  newNounskey.push(nounId);
                }
              });
              if(newNounskey.length>0){
                _db_createNoun(resolve, reject, newNounskey, modifiedBody);
              }else{
                resolve(modifiedBody);
              }
            }).then((modifiedBody)=>{
              return new Promise((resolve, reject)=>{
                _db_addAttribution(resolve, reject);
              })
            })
          }).then(()=>{
            let resData = {};
            resData['error'] = 0;
            resData['message'] = 'post req completed!';
            res.status(201).json(resData);
            connection.release();
          }).catch((err)=>{
            console.log("error occured during newShare promise: "+err)
            _handler_err_Internal(err, res);
            connection.release();
          });
        }
      })
    }
  })
}

module.exports = shareHandler_POST
