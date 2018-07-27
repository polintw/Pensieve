const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require("path");
const jsonfile = require('jsonfile');
const mkdirp = require('mkdirp');
const update = require('immutability-helper');

const React = require('react');
const ReactDOMServer = require('react-dom/server');

const router = require('./src/router.js');

//babel-polyfill is here for the whole code after it!
require('babel-polyfill');

app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine({transformViews: false }));
app.use(bodyParser.json({limit: '20mb'}));//parse Content-Type: /json
app.use(bodyParser.raw({limit: "20mb"}));//parse Content-Type: /application/octet-stream
//app.use(bodyParser.text({limit: '20mb'})); //parse Content-Type: /text //not in use in this project
app.use(bodyParser.urlencoded({extended: true}));

//establish the statics resources
app.use(express.static(path.join(__dirname+'/public')));
app.use(express.static(path.join(__dirname+'/pages')));

//begining managing the specific request
app.get('/favicon.ico', function(req, res){
  console.log('requesting for favicon');
  res.end();
})

app.use('/router', router)

app.patch('/patch/user/collection', function(req, res){
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

app.post('/post/user/shared/:purpose', function(req, res){
  console.log('post of share for '+req.params.purpose);
  if(req.params.purpose=="new"){
    let fileName = req.body.submitTime;
    new Promise((resolve, reject)=>{
      //add it into shares as a obj value
      console.log('add new one: deal img.');
      let modifiedBody = new Object();
      //deal with cover img first.
      let coverBase64Splice = req.body.coverBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
      let coverBase64Buffer = new Buffer(coverBase64Splice[2], 'base64');
      fs.writeFile('./dev/Statics_units/images/'+fileName+"_cover.jpg", coverBase64Buffer, function(err){
        if(err) {console.log('err in adding new img from new share');reject(err);}
      });
      modifiedBody['img_cover'] = fileName+'_cover.jpg';
      //then deal with beneath img if any.
      if(req.body.beneathBase64){
        let beneathBase64Splice = req.body.beneathBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
        let beneathBase64Buffer = new Buffer(beneathBase64Splice[2], 'base64');
        modifiedBody['img_beneath'] = fileName+'_beneath.jpg';
        fs.writeFile('./dev/Statics_units/images/'+fileName+"_beneath.jpg", beneathBase64Buffer, function(err){
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
        fs.mkdir('./dev/Statics_units/'+fileName, function(err){
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
        jsonfile.writeFile('./dev/Statics_units/'+fileName+"/marks.json", newMakrsObj, {spaces: 2}, function(err){
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
        jsonfile.writeFile('./dev/Statics_units/'+fileName+"/conversations.json", conversationsObj, {spaces: 2}, function(err){
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
        jsonfile.writeFile('./dev/Statics_units/'+fileName+"/details.json", modifiedBody, {spaces: 2}, function(err){
          if(err) {console.log('err in add new one: write into the details.');reject(err);}
          resolve()
        });
      })
    }).then(function(){
      console.log('add new one: create the bounding list.');
      return new Promise((resolve, reject)=>{
        jsonfile.writeFile('./dev/Statics_units/'+fileName+"/listBounding.json", {collection: []}, {spaces: 2}, function(err){
          if(err) {console.log('err in add new one: write into the bounding list.');reject(err);}
          resolve()
        });
      })
    }).then(function(){
      //add it into overview list
      console.log('add new one: write into the units "idList".');
      return new Promise((resolve, reject)=>{
        jsonfile.readFile("./dev/Statics_units/idList.json", function(err, lists){
          if(err) {console.log('err in add new one into the units "idList".');reject(err);}
          let updatedData = update(lists, {
            ['idArr']: {
              $unshift: [fileName]
            }
          })
          jsonfile.writeFile("./dev/Statics_units/idList.json", updatedData, {spaces: 2}, function(err){
            if(err) {console.log('err in add new one into the units "idList".');reject(err);}
          });
          resolve();
        })
      })
    }).then(function(){
      //add it into overview list
      console.log('add new one: write into the shared list.');
      return new Promise((resolve, reject)=>{
        jsonfile.readFile("./dev/Statics_users/user/listShared.json", function(err, lists){
          if(err) {console.log('err in add new one into the shared list.');reject(err);}
          let updatedData = update(lists, {
            ['listArr']: {
              $unshift: [fileName]
            }
          })
          jsonfile.writeFile("./dev/Statics_users/user/listShared.json", updatedData, {spaces: 2}, function(err){
            if(err) {console.log('err in add new one into the list.');reject(err);}
          });
          resolve();
        })
      })
    }).then(function(){
      //add it into time list
      console.log('add new one: write into the time list.');
      return new Promise((resolve, reject)=>{
        jsonfile.readFile("./dev/Statics_users/user/listTime.json", function(err, lists){
          if(err) {console.log('err during reading a jsonfile: listTime.');reject(err);}
          let updatedData = update(lists, {
            ['listArr']: {
              $unshift: [fileName]
            }
          })
          jsonfile.writeFile("./dev/Statics_users/user/listTime.json", updatedData, {spaces: 2}, function(err){
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
})

app.use('/self/units', function(req, res){
  console.log("requesting for page: "+req.url);
  //fail to use serverrender aafter update to react v16.2.0 due to: "<>" not support in nodejs
  //const element = React.createElement(require('./initHTML.jsx'));
  //ReactDOMServer.renderToNodeStream(element).pipe(res);

  res.sendFile(path.join(__dirname+'/Pages/html_SelfUnitBase.html'), {headers: {'Content-Type': 'text/html'}}, function (err) {
    if (err) {
      throw err
    }
  });
})

app.use('/self', function(req, res){
  console.log("requesting for page: "+req.url);
  //fail to use serverrender aafter update to react v16.2.0 due to: "<>" not support in nodejs
  //const element = React.createElement(require('./initHTML.jsx'));
  //ReactDOMServer.renderToNodeStream(element).pipe(res);

  res.sendFile(path.join(__dirname+'/Pages/html_SelfCover.html'), {headers: {'Content-Type': 'text/html'}}, function (err) {
    if (err) {
      throw err
    }
  });
})

app.use('/', function(req, res){
  console.log("requesting for page: "+req.url);
  //fail to use serverrender aafter update to react v16.2.0 due to: "<>" not support in nodejs
  //const element = React.createElement(require('./initHTML.jsx'));
  //ReactDOMServer.renderToNodeStream(element).pipe(res);

  res.sendFile(path.join(__dirname+'/Pages/html_Within.html'), {headers: {'Content-Type': 'text/html'}}, function (err) {
    if (err) {
      throw err
    }
  });
})

app.listen(process.env.port || 8081);
console.log("Running at Port 8081");
