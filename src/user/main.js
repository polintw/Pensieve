const express = require('express');
const main = express.Router();
const fs = require('fs');
const path = require("path");
const jsonfile = require('jsonfile');
const update = require('immutability-helper');

const cognitionExecutive = require('./cognition/execute.js');
const shareExecutive = require('./shareds/execute.js');
const coverExecutive = require('./cover/execute.js');
const actionExecutive = require('./action/execute.js');

main.param("id", (req, res, next, id)=>{
  req.requesterId = id;
  console.log(req.requesterId);
  next();
})

main.use('/:id/shareds', shareExecutive)

main.use('/cognition', cognitionExecutive)

main.use('/cover', coverExecutive)

main.use('/action', actionExecutive)

main.patch('/newCollect', function(req, res){
  console.log('patch collection to user');
  new Promise((resolve, reject)=>{
    jsonfile.readFile("./dev/Statics_users/user/listCollection.json", function(err, lists){
      if(err) {console.log('err in add new one into the list.');reject(err);}
      let updatedData = update(lists, {
        ['listArr']: {
          $unshift: [req.body.unitName]
        }
      })
      jsonfile.writeFile("./dev/Statics_users/user/listCollection.json", updatedData, {spaces: 2}, function(err){
        if(err) {console.log('err in add new one into the list.');reject(err);}
      });
      resolve();
    })
  }).then(function(){
    //add it into time list
    console.log('add new one: write into the time list.');
    return new Promise((resolve, reject)=>{
      jsonfile.readFile("./dev/Statics_users/user/listTime.json", function(err, lists){
        if(err) {console.log('err in add new one into the time list.');reject(err);}
        let updatedData = update(lists, {
          ['listArr']: {
            $unshift: [fileName]
          }
        })
        jsonfile.writeFile("./dev/Statics_users/user/listTime.json", updatedData, {spaces: 2}, function(err){
          if(err) {console.log('err in add new one into the time list.');reject(err);}
        });
        resolve();
      })
    })
  }).then(()=>{
    res.status(200).json({
      success: true
    });
  }).catch(
    (err)=>{
      console.log('err during promise of patching collection: '+err);
      res.status(500).json({
        success: false,
        err: err
      });
    }
  );
});

module.exports = main;
