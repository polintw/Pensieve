const fs = require('fs');
const path = require("path");
const jsonfile = require('jsonfile');
const mkdirp = require('mkdirp');
const update = require('immutability-helper');

function _handle_NewShare(req, res){
  let fileName = req.body.submitTime;
  new Promise((resolve, reject)=>{
    //add it into shares as a obj value
    console.log('add new one: deal img.');
    let modifiedBody = new Object();
    //deal with cover img first.
    let coverBase64Splice = req.body.coverBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
    let coverBase64Buffer = new Buffer(coverBase64Splice[2], 'base64');
    fs.writeFile(path.join(__dirname, '/../../..', '/dev/Statics_units/images/'+fileName+"_cover.jpg"), coverBase64Buffer, function(err){
      if(err) {console.log('err in adding new img from new share');reject(err);}
    });
    modifiedBody['img_cover'] = fileName+'_cover.jpg';
    //then deal with beneath img if any.
    if(req.body.beneathBase64){
      let beneathBase64Splice = req.body.beneathBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
      let beneathBase64Buffer = new Buffer(beneathBase64Splice[2], 'base64');
      modifiedBody['img_beneath'] = fileName+'_beneath.jpg';
      fs.writeFile(path.join(__dirname, '/../../..', '/dev/Statics_units/images/'+fileName+"_beneath.jpg"), beneathBase64Buffer, function(err){
        if(err) {console.log('err in adding new img from new share');reject(err);}
      });
    }

    Object.assign(modifiedBody, req.body);
    delete modifiedBody.coverBase64;
    delete modifiedBody.beneathBase64;

    resolve(modifiedBody)
  }).then(function(modifiedBody){
    console.log('add new one: establish folder.');
    return new Promise((resolve, reject)=>{
      fs.mkdir(path.join(__dirname, '/../../..', '/dev/Statics_units/'+fileName), function(err){
        if(err) {console.log('err in add new one: establish folder');reject(err);}
        resolve(modifiedBody);
      })
    })
  }).then(function(modifiedBody){
    console.log('add new one: abstract marksObj.');
    return new Promise((resolve, reject)=>{
      //final data object writed into a new file
      let newMakrsObj = {
        coverMarksObj: modifiedBody.coverMarksObj,
        beneathMarksObj: modifiedBody.beneathMarksObj,
      }
      jsonfile.writeFile(path.join(__dirname, '/../../..', '/dev/Statics_units/'+fileName+"/marks.json"), newMakrsObj, {spaces: 2}, function(err){
        if(err) {console.log('err in add new one: abstract marksObj');reject(err);}
        resolve(modifiedBody)
      });
    })
  }).then(function(modifiedBody){
    console.log('add new one: create conversation file.');
    return new Promise((resolve, reject)=>{
      let coverMarksKey = Object.keys(modifiedBody.coverMarksObj);
      let beneathMarksKey = Object.keys(modifiedBody.beneathMarksObj);
      let conversationsObj = new Object();
      coverMarksKey.forEach((key, index)=>{conversationsObj[key] = {}});
      beneathMarksKey.forEach((key, index)=>{conversationsObj[key] = {}});
      jsonfile.writeFile(path.join(__dirname, '/../../..', '/dev/Statics_units/'+fileName+"/conversations.json"), conversationsObj, {spaces: 2}, function(err){
        if(err) {console.log('err in add new one: write into the conversations.');reject(err);}
        delete modifiedBody.coverMarksObj;
        delete modifiedBody.beneathMarksObj;

        resolve(modifiedBody)
      });
    })
  }).then(function(modifiedBody){
    console.log('add new one: write into the details.');
    return new Promise((resolve, reject)=>{
      //data object writed into a new file
      jsonfile.writeFile(path.join(__dirname, '/../../..', '/dev/Statics_units/'+fileName+"/details.json"), modifiedBody, {spaces: 2}, function(err){
        if(err) {console.log('err in add new one: write into the details.');reject(err);}
        resolve()
      });
    })
  }).then(function(){
    console.log('add new one: create the bounding list.');
    return new Promise((resolve, reject)=>{
      jsonfile.writeFile(path.join(__dirname, '/../../..', '/dev/Statics_units/'+fileName+"/listBounding.json"), {collection: []}, {spaces: 2}, function(err){
        if(err) {console.log('err in add new one: write into the bounding list.');reject(err);}
        resolve()
      });
    })
  }).then(function(){
    //add it into overview list
    console.log('add new one: write into the units "idList".');
    return new Promise((resolve, reject)=>{
      jsonfile.readFile(path.join(__dirname, '/../../..', '/dev/Statics_units/idList.json'), function(err, lists){
        if(err) {console.log('err in add new one into the units "idList".');reject(err);}
        let updatedData = update(lists, {
          ['idArr']: {
            $unshift: [fileName]
          }
        })
        jsonfile.writeFile(path.join(__dirname, '/../../..', "/dev/Statics_units/idList.json"), updatedData, {spaces: 2}, function(err){
          if(err) {console.log('err in add new one into the units "idList".');reject(err);}
        });
        resolve();
      })
    })
  }).then(function(){
    //add it into overview list
    console.log('add new one: write into the shared list.');
    return new Promise((resolve, reject)=>{
      jsonfile.readFile(path.join(__dirname, '/../../..', "/dev/Statics_users/user/listShared.json"), function(err, lists){
        if(err) {console.log('err in add new one into the shared list.');reject(err);}
        let updatedData = update(lists, {
          ['listArr']: {
            $unshift: [fileName]
          }
        })
        jsonfile.writeFile(path.join(__dirname, '/../../..', "/dev/Statics_users/user/listShared.json"), updatedData, {spaces: 2}, function(err){
          if(err) {console.log('err in add new one into the list.');reject(err);}
        });
        resolve();
      })
    })
  }).then(function(){
    //add it into time list
    console.log('add new one: write into the time list.');
    return new Promise((resolve, reject)=>{
      jsonfile.readFile(path.join(__dirname, '/../../..', "/dev/Statics_users/user/listTime.json"), function(err, lists){
        if(err) {console.log('err during reading a jsonfile: listTime.');reject(err);}
        let updatedData = update(lists, {
          ['listArr']: {
            $unshift: [fileName]
          }
        })
        jsonfile.writeFile(path.join(__dirname, '/../../..', "/dev/Statics_users/user/listTime.json"), updatedData, {spaces: 2}, function(err){
          if(err) {console.log('err during writing into: listTime.');reject(err);}
        });
        resolve();
      })
    })
  }).then(()=>{
    res.status(201).json({
      success: true
    });
  }).catch(
    (err)=>{
      console.log('err during promise of posting new share: '+err);
      res.status(500).json({
        success: false,
        err: err
      });
    }
  );
}

module.exports = _handle_NewShare
