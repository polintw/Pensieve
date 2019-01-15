const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require("path");

const rateLimit = require("express-rate-limit");

const router = require('./src/router.js');

//babel-polyfill is here for the whole code after it!
require('babel-polyfill');

app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine({transformViews: false }));

app.enable("trust proxy"); //for rateLimit, due to behind a reverse proxy(nginx)
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 200, // limit each IP to 100 requests per windowMs
  message:
    "Too many request from this IP, please try again later",
  onLimitReached: function(req, res){
    console.log('WARN: too many request '+req.ip)
  }
});
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message:
    "Login failed too many time or wierd behavior from this IP, please try again after 15 min.",
  onLimitReached: function(req, res){
    console.log('WARN: login exceeded from '+req.ip)
  }
});
app.use(limiter); //rate limiter apply to all requests
app.use("/router/login", loginLimiter); // restrict specially for login behavior, but should use username one day

app.use(bodyParser.json({limit: '20mb'}));//parse Content-Type: /json
app.use(bodyParser.raw({limit: "20mb"}));//parse Content-Type: /application/octet-stream
app.use(bodyParser.text({limit: '20mb'})); //parse Content-Type: /text, like pure base64 string in this project
app.use(bodyParser.urlencoded({extended: true}));

//establish the statics resources
app.use(express.static(path.join(__dirname+'/public')));

//begining managing the specific request
app.get('/favicon.ico', function(req, res){
  console.log('requesting for favicon');
  res.end();
})

app.use('/router', router)

app.use('/user/screen', function(req, res){
  console.log("requesting for page: "+req.url);
  //fail to use serverrender aafter update to react v16.2.0 due to: "<>" not support in nodejs
  //const element = React.createElement(require('./initHTML.jsx'));
  //ReactDOMServer.renderToNodeStream(element).pipe(res);

  res.sendFile(path.join(__dirname+'/public/html/html_Terrace.html'), {headers: {'Content-Type': 'text/html'}}, function (err) {
    if (err) {
      throw err
    }
  });
})

app.use('/user', function(req, res){
  console.log("requesting for page: "+req.url);
  //fail to use serverrender aafter update to react v16.2.0 due to: "<>" not support in nodejs
  //const element = React.createElement(require('./initHTML.jsx'));
  //ReactDOMServer.renderToNodeStream(element).pipe(res);

  res.sendFile(path.join(__dirname+'/public/html/html_SelfFront.html'), {headers: {'Content-Type': 'text/html'}}, function (err) {
    if (err) {
      throw err
    }
  });
})

app.use('/s', function(req, res){
  console.log("requesting for page: "+req.url);
  //fail to use serverrender aafter update to react v16.2.0 due to: "<>" not support in nodejs
  //const element = React.createElement(require('./initHTML.jsx'));
  //ReactDOMServer.renderToNodeStream(element).pipe(res);

  res.sendFile(path.join(__dirname+'/public/html/html_Sign.html'), {headers: {'Content-Type': 'text/html'}}, function (err) {
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

  res.sendFile(path.join(__dirname+'/public/html/html_Within.html'), {headers: {'Content-Type': 'text/html'}}, function (err) {
    if (err) {
      throw err
    }
  });
})

app.listen(process.env.port || 8080);
console.log("Running at Port 8080");
