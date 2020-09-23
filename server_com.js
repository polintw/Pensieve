const express = require('express');
const app = express();
const path = require("path");
const bodyParser = require('body-parser');

const winston = require('./config/winston.js');
const {
  envBasic,
  envServiceGeneral
} = require('./config/.env.json');
const {
  limiter,
} = require('./src/rateLimiter.js');


//babel-polyfill is here for the whole code after it!
require('babel-polyfill');

app.set('view engine', 'jsx');
app.set('view engine', 'pug'); //we add second engine due to the requirement for rendering dynamic html
app.engine('jsx', require('express-react-views').createEngine({transformViews: false }));
app.enable("trust proxy"); //for rateLimit, due to behind a reverse proxy(nginx)


//rate limit by ip
app.use(limiter); //rate limiter apply to all requests

//parse url comeing in
app.use(bodyParser.json({limit: '20mb'}));//parse Content-Type: /json
app.use(bodyParser.raw({limit: "20mb"}));//parse Content-Type: /application/octet-stream
app.use(bodyParser.text({limit: '20mb'})); //parse Content-Type: /text, like pure base64 string in this project
app.use(bodyParser.urlencoded({extended: true}));


//then for the rest of path, including plain '/', we need to identify source and purpose
app.use('/', function(req, res, next){
  winston.info(`${"page: requesting for Within under .com domain "} '${req.originalUrl }', ${req.method}, ${"from ip "}, ${req.ip}, ${" redirect to .tw domain."}`);
  let redirection = "https://" + envServiceGeneral.appDomain;
  if( req.originalUrl.length >1 ){ // != '/'
    redirection += req.originalUrl;
  };

  res.redirect(301, redirection);
});


// initiate api server
app.listen( envBasic.port_com );
winston.warn(".com server initiating, running at Port "+envBasic.port_com);
