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
app.use(express.static(path.join(__dirname+'/app')));
app.use('/favicon.ico', function(req, res){
  console.log('requesting for favicon');
  res.end();
})

app.get('/get/public/noun', function(req, res){
  console.log('get public: noun search');
  let prefix = req.query.prefix;
  res.status(200).json({'results': [prefix]});
})

app.post('/post/user/share/:purpose', function(req, res){
  console.log('post of share for '+purpose);
  if(req.params.purpose=="new"){
    let fileName = req.body.submitTime;
    new Promise((resolve, reject)=>{
      //add it into shares as a obj value
      console.log('start add new share into shares dir');
      let modifiedBody = new Object();
      //deal with cover img first.
      let coverBase64Splice = req.body.coverBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
      let coverBase64Buffer = new Buffer(coverBase64Splice[2], 'base64');
      fs.writeFile('./statics_users/user/shared/images/'+fileName+"_cover.jpg", coverBase64Buffer, function(err){
        if(err) {console.log('err in adding new img from new share');reject(err);}
      });
      modifiedBody['img_cover'] = '/shared/images/'+fileName+'_cover.jpg';
      //then deal with beneath img if any.
      if(req.body.beneathBase64){
        let beneathBase64Splice = req.body.beneathBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
        let beneathBase64Buffer = new Buffer(beneathBase64Splice[2], 'base64');
        modifiedBody['img_beneath'] = '/shared/images/'+fileName+'_beneath.jpg';
        fs.writeFile('./statics_users/user/shared/images/'+fileName+"_beneath.jpg", beneathBase64Buffer, function(err){
          if(err) {console.log('err in adding new img from new share');reject(err);}
        });
      }

      delete modifiedBody.coverBase64;
      delete modifiedBody.beneathBase64;
      Object.assign(modifiedBody, req.body);
      //final data object writed into a new file
      jsonfile.readFile('./statics_users/user/shared/sharedData.json', function(err, sharedData){
        if(err) {console.log('err in Read_Displaydata');reject(err);}
        let updatedData = update(sharedData, {
          [fileName]: {
            $set: modifiedBody
          }
        })
        jsonfile.writeFile("./statics_users/user/shared/sharedData.json", updatedData, {spaces: 2}, function(err){
          if(err) {console.log('err in writing new share to a new file.');reject(err);}
        });
        resolve()
      });
    }).then(function(){
      //add it into overview list
      console.log('add new one into the list.');
      return new Promise((resolve, reject)=>{
        jsonfile.readFile("./statics_users/user/sharedList.json", function(err, listArr){
          if(err) {console.log('err in add new one into the list.');reject(err);}
          let updatedData = update(listArr, {
            $unshift: [fileName]
          })
          jsonfile.writeFile("./statics_users/user/sharedList.json", updatedData, {spaces: 2}, function(err){
            if(err) {console.log('err in add new one into the list.');reject(err);}
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
        console.log('err during promise of posting new share: '+err);
        res.status(500).json({
          success: false,
          err: err
        });
      }
    );
  }
})

app.use('/', function(req, res){
  console.log("requesting for index: "+req.url);
  //fail to use serverrender aafter update to react v16.2.0 due to: "<>" not support in nodejs
  //const element = React.createElement(require('./initHTML.jsx'));
  //ReactDOMServer.renderToNodeStream(element).pipe(res);

  res.sendFile(path.join(__dirname+'/app/_dev/Self/html_Self.html'), {headers: {'Content-Type': 'text/html'}}, function (err) {
    if (err) {
      throw err
    }
  });
})

app.listen(process.env.port || 8081);
console.log("Running at Port 8081");
