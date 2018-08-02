const fs = require('fs');
const path = require("path");
const jsonfile = require('jsonfile');
const mkdirp = require('mkdirp');
const update = require('immutability-helper');

exports._promise_unitMount = function(req, res){
  const reqUnit = req.query.unitName;
  const reqUser = req.query.id; //should come from token verified in the future.

  new Promise((resolve, reject)=>{
    console.log('get old one: details.');
    jsonfile.readFile('./dev/Statics_units/'+reqUnit+'/details.json', function(err, data){
      if(err) {console.log('err in Read_sharedData');reject(err);}
      let sendingData = new Object();
      Object.assign(sendingData, data);
      resolve(sendingData)
    })
  }).then(function(sendingData){
    return new Promise((resolve, reject)=>{
      console.log('get old one: check permission.');
      sendingData['action'] = 'both';
      if(sendingData.arthur == reqUser){
        sendingData['action'] = 'edit';
        resolve(sendingData);
      }else{
        jsonfile.readFile('./dev/Statics_users/user/listCollection.json', function(err, data){
          if(err) {console.log('err in Read_listCollection');reject(err);};
          data["listArr"].forEach(function(name, index){
            if(reqUnit == name){
              sendingData['action'] = 'collected';
            }
          })
          resolve(sendingData);
        })
      }
    })
  }).then(function(sendingData){
    return new Promise((resolve, reject)=>{
      console.log('get old one: marks.');
      jsonfile.readFile('./dev/Statics_units/'+reqUnit+'/marks.json', function(err, data){
        if(err) {console.log('err in Read_marksData');reject(err);}
        sendingData['coverMarksObj'] = data.coverMarksObj;
        sendingData['beneathMarksObj'] = data.beneathMarksObj;
        resolve(sendingData);
      });
    })
  }).then((sendingData)=>{
    res.status(200).json(sendingData);
  }).catch(
    (err)=>{
      console.log('err during promise of get unit data: '+err);
      res.status(500).json({
        success: false,
        err: err
      });
    }
  );
};
