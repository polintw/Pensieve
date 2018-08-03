const express = require('express');
const main = express.Router();
const fs = require('fs');
const path = require("path");
const jsonfile = require('jsonfile');
const update = require('immutability-helper');


main.get('/thumb', function(req, res){
  console.log('get img request: thumb for '+req.query.name);
  const reqImg = req.query.name;
  res.sendFile(path.join(__dirname, '/../..', '/dev/statics_units/images/'+reqImg), {headers: {'Content-Type': 'image'}}, function (err) {
    if (err) {
      throw err
    }
  });
})

main.get('/unitSingle', function(req, res){
  console.log('get img request: unitSingle for '+req.query.name);
  const reqImg = req.query.name;
  fs.readFile(path.join(__dirname, '/../..', '/dev/statics_units/images/'+reqImg), function(err, imgBuffer){
    if(err) {console.log('err in Read_imgFile');reject(err);};
    let imgBase64 = new Buffer(imgBuffer, 'binary').toString('base64');
    imgBase64 = 'data:image/jpeg;base64,' + imgBase64;
    res.send(imgBase64);
  });
})


module.exports = main;
