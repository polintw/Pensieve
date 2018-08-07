const express = require('express');
const main = express.Router();
const fs = require('fs');
const path = require("path");
const jsonfile = require('jsonfile');
const update = require('immutability-helper');

main.use('/:name', function(req, res){
  console.log('get img request: '+req.query.type+' for '+req.params.name);
  const reqImg = req.params.name;
  switch(req.query.type){
    case 'thumb':
      res.sendFile(path.join(__dirname, '/../..', '/dev/faked_Pics/'+reqImg), {headers: {'Content-Type': 'image'}}, function (err) {
        if (err) {
          throw err
        }
      });
      break;
    case  'unitSingle':
      fs.readFile(path.join(__dirname, '/../..', '/dev/faked_Pics/'+reqImg), function(err, imgBuffer){
        if(err) {console.log('err in Read_imgFile');reject(err);};
        let imgBase64 = new Buffer(imgBuffer, 'binary').toString('base64');
        imgBase64 = 'data:image/jpeg;base64,' + imgBase64;
        res.send(imgBase64);
      });
      break;
    default:
      res.sendFile(path.join(__dirname, '/../..', '/dev/faked_Pics/'+reqImg), {headers: {'Content-Type': 'image'}}, function (err) {
        if (err) {
          throw err
        }
      });
  }
})


module.exports = main;
