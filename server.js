const express = require('express');
const app = express();
const fs = require('fs');
const request = require('request');
const bodyParser = require('body-parser');
const path = require("path");
const jsonfile = require('jsonfile');
const mkdirp = require('mkdirp');
const update = require('immutability-helper');
const cheerio = require('cheerio');
//test 
const React = require('react');
const ReactDOMServer = require('react-dom/server');

//Important!! babel-polyfill is here for the whole code after it!
require('babel-polyfill');

app.set('view engine', 'jsx');
app.set('app', __dirname + '/app');
app.engine('jsx', require('express-react-views').createEngine({transformViews: false }));
//parse .json came into this server
//parse Content-Type: /json
app.use(bodyParser.json({limit: '20mb'}));
//parse Content-Type: /text
//app.use(bodyParser.text({limit: '20mb'})); //not in use in this project
app.use(bodyParser.urlencoded({extended: true}));
//parse Content-Type: /application/octet-stream
app.use(bodyParser.raw({limit: "20mb"}))

app.use(express.static(path.join(__dirname+'/statics_public')));
app.use(express.static(path.join(__dirname+'/statics_shared')));
app.use(express.static(path.join(__dirname+'/Pages')));
app.use(express.static(path.join(__dirname+'/Styles')));
app.use('/favicon.ico', function(req, res){
  console.log('requesting for favicon');
  res.end();
})

app.get('/get/public/noun', function(req, res){
  console.log('get public: noun search');
  let prefix = req.query.prefix;
  res.status(200).json({'results': [prefix]});
})

app.get('/get/unit/ltd', function(req, res){
  console.log('get unit request: user');
  new Promise((resolve, reject)=>{
    jsonfile.readFile('./statics_shared/sharedDetails.json', function(err, data){
      if(err) {console.log('err in Read_sharedData');reject(err);}
      let sendingData = new Object();
      let unitsList = Object.keys(data);
      Object.assign(sendingData, {unitsList: unitsList});
      Object.assign(sendingData, {unitsDataSet: data});
      resolve(sendingData)
    });
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
})

app.get('/get/unit/single', function(req, res){
  console.log('get unit request: '+ req.query.unitName);
  const reqUnit = req.query.unitName;
  const reqUser = req.query.id; //should come from token verified in the future.

  new Promise((resolve, reject)=>{
    console.log('get old one: details.');
    jsonfile.readFile('./statics_shared/sharedDetails.json', function(err, data){
      if(err) {console.log('err in Read_sharedData');reject(err);}
      let focusUnit = data[reqUnit];
      let sendingData = new Object();
      Object.assign(sendingData, focusUnit);
      resolve(sendingData)
    })
  }).then(function(sendingData){
    return new Promise((resolve, reject)=>{
      console.log('get old one: imgs.');
      fs.readFile('./statics_shared'+sendingData['img_cover'], function(err, coverImg){
        if(err) {console.log('err in Read_coverImg');reject(err);};
        let coverBase64 = new Buffer(coverImg, 'binary').toString('base64');
        coverBase64 = 'data:image/jpeg;base64,' + coverBase64;
        sendingData['coverBase64'] = coverBase64;
        delete sendingData.img_cover;
        if(sendingData['img_beneath']){
          fs.readFile('./statics_shared'+sendingData['img_beneath'], function(err, beneathImg){
            if(err) {console.log('err in Read_beneathImg');reject(err);};
            let beneathBase64 = new Buffer(beneathImg, 'binary').toString('base64');
            beneathBase64 = 'data:image/jpeg;base64,' + beneathBase64;
            sendingData['beneathBase64'] = beneathBase64;
            delete sendingData.img_beneath;
            resolve(sendingData)
          });
        }else{
          resolve(sendingData)
        }
      });
    })
  }).then(function(sendingData){
    return new Promise((resolve, reject)=>{
      console.log('get old one: check permission.');
      sendingData['action'] = 'both';
      if(sendingData.arthur == reqUser){
        sendingData['action'] = 'edit';
        resolve(sendingData);
      }else{
        jsonfile.readFile('./statics_users/user/collectionList.json', function(err, data){
          if(err) {console.log('err in Read_collectionList');reject(err);};
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
      jsonfile.readFile('./statics_shared/sharedMarks.json', function(err, data){
        if(err) {console.log('err in Read_marksData');reject(err);}
        let marksData = data[reqUnit];
        sendingData['coverMarksObj'] = marksData.coverMarksObj;
        sendingData['beneathMarksObj'] = marksData.beneathMarksObj;
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
})

app.get('/get/user/shared', function(req, res){
  console.log('get shared request: '+ req.query.purpose);
  new Promise((resolve, reject)=>{
    jsonfile.readFile('./statics_users/user/sharedList.json', function(err, data){
      if(err) {console.log('err in Read_sharedList');reject(err);}
      let sendingData = new Object();
      Object.assign(sendingData, {unitsList: data.listArr});
      resolve(sendingData)
    })
  }).then(function(sendingData){
    return new Promise((resolve, reject)=>{
      jsonfile.readFile('./statics_shared/sharedDetails.json', function(err, data){
        if(err) {console.log('err in Read_sharedData');reject(err);}
        let dataSet = new Object();
        sendingData.unitsList.forEach((name, index) => {
          dataSet[name] = data[name]; //could damage the origin?
        });
        Object.assign(sendingData, {unitsDataSet: dataSet});
        resolve(sendingData)
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
})

app.get('/get/user/collection', function(req, res){
  console.log('get collection request: '+ req.query.purpose);
  new Promise((resolve, reject)=>{
    jsonfile.readFile('./statics_users/user/collectionList.json', function(err, data){
      if(err) {console.log('err in Read_collectionList');reject(err);}
      let sendingData = new Object();
      Object.assign(sendingData, {unitsList: data.listArr});
      resolve(sendingData)
    })
  }).then(function(sendingData){
    return new Promise((resolve, reject)=>{
      jsonfile.readFile('./statics_shared/sharedDetails.json', function(err, data){
        if(err) {console.log('err in Read_sharedData');reject(err);}
        let dataSet = new Object();
        sendingData.unitsList.forEach((name, index) => {
          dataSet[name] = data[name]; //could damage the origin?
        });
        Object.assign(sendingData, {unitsDataSet: dataSet});
        resolve(sendingData)
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
})

app.patch('/patch/user/collection', function(req, res){
  console.log('patch collection to user');
  new Promise((resolve, reject)=>{
    jsonfile.readFile("./statics_users/user/collectionList.json", function(err, lists){
      if(err) {console.log('err in add new one into the list.');reject(err);}
      let updatedData = update(lists, {
        ['listArr']: {
          $unshift: [req.body.unitName]
        }
      })
      jsonfile.writeFile("./statics_users/user/collectionList.json", updatedData, {spaces: 2}, function(err){
        if(err) {console.log('err in add new one into the list.');reject(err);}
      });
      resolve();
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
      fs.writeFile('./statics_shared/images/'+fileName+"_cover.jpg", coverBase64Buffer, function(err){
        if(err) {console.log('err in adding new img from new share');reject(err);}
      });
      modifiedBody['img_cover'] = '/images/'+fileName+'_cover.jpg';
      //then deal with beneath img if any.
      if(req.body.beneathBase64){
        let beneathBase64Splice = req.body.beneathBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
        let beneathBase64Buffer = new Buffer(beneathBase64Splice[2], 'base64');
        modifiedBody['img_beneath'] = '/images/'+fileName+'_beneath.jpg';
        fs.writeFile('./statics_shared/images/'+fileName+"_beneath.jpg", beneathBase64Buffer, function(err){
          if(err) {console.log('err in adding new img from new share');reject(err);}
        });
      }

      Object.assign(modifiedBody, req.body);
      delete modifiedBody.coverBase64;
      delete modifiedBody.beneathBase64;

      resolve(modifiedBody)
    }).then(function(modifiedBody){
      console.log('add new one: abstract marksObj.');
      return new Promise((resolve, reject)=>{
        //final data object writed into a new file
        jsonfile.readFile('./statics_shared/sharedMarks.json', function(err, data){
          if(err) {console.log('err in Read_marksData');reject(err);}
          let newMakrsObj = {
            coverMarksObj: modifiedBody.coverMarksObj,
            beneathMarksObj: modifiedBody.beneathMarksObj,
          }
          let updatedData = update(data, {
            [fileName]: {
              $set: newMakrsObj
            }
          })
          jsonfile.writeFile("./statics_shared/sharedMarks.json", updatedData, {spaces: 2}, function(err){
            if(err) {console.log('err in writing new share to sharedMarks.');reject(err);}
          });

          delete modifiedBody.coverMarksObj;
          delete modifiedBody.beneathMarksObj;

          resolve(modifiedBody)
        });
      })
    }).then(function(modifiedBody){
      console.log('add new one: write into the details.');
      return new Promise((resolve, reject)=>{
        //final data object writed into a new file
        jsonfile.readFile('./statics_shared/sharedDetails.json', function(err, data){
          if(err) {console.log('err in Read_Displaydata');reject(err);}
          let updatedData = update(data, {
            [fileName]: {
              $set: modifiedBody
            }
          })
          jsonfile.writeFile("./statics_shared/sharedDetails.json", updatedData, {spaces: 2}, function(err){
            if(err) {console.log('err in writing new share to sharedDetails.');reject(err);}
          });
          resolve()
        });
      })
    }).then(function(){
      //add it into overview list
      console.log('add new one: write into the list.');
      return new Promise((resolve, reject)=>{
        jsonfile.readFile("./statics_users/user/sharedList.json", function(err, lists){
          if(err) {console.log('err in add new one into the list.');reject(err);}
          let updatedData = update(lists, {
            ['listArr']: {
              $unshift: [fileName]
            }
          })
          jsonfile.writeFile("./statics_users/user/sharedList.json", updatedData, {spaces: 2}, function(err){
            if(err) {console.log('err in add new one into the list.');reject(err);}
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

app.use('/user', function(req, res){
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
