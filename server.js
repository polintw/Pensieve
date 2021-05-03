const express = require('express');
const app = express();
const path = require("path");
const bodyParser = require('body-parser');
const crawlers = require('crawler-user-agents');

const router = require('./src/router.js');
const routerPathWithin = require('./src/routerPathWithin.js');
const winston = require('./config/winston.js');
const {envBasic} = require('./config/.env.json');
const {domain} = require('./config/services.js');
const {
  limiter,
  loginLimiter,
  registerLimiter,
  forgetLimiter,
  shareLimiter,
  accountPwLimiter,
  nodesSearchLimiter,
  belongsPatchLimiter
} = require('./src/rateLimiter.js');
const mailTimer = require("./scripts/mailer/mailTimer.js");
const _DB_units = require('./db/models/index').units;
const _DB_unitsReqOrigin = require('./db/models/index').units_req_origin;


//babel-polyfill is here for the whole code after it!
require('babel-polyfill');

app.set('view engine', 'jsx');
app.set('view engine', 'pug'); //we add second engine due to the requirement for rendering dynamic html
app.engine('jsx', require('express-react-views').createEngine({transformViews: false }));
app.enable("trust proxy"); //for rateLimit, due to behind a reverse proxy(nginx)


//rate limit by ip
app.use(limiter); //rate limiter apply to all requests
app.use("/router/login", loginLimiter); // restrict specially for login behavior, but should use username one day
app.use("/router/register", registerLimiter);
app.use("/router/forget", forgetLimiter);
app.post("/router/share", shareLimiter);
app.use("/router/account/password", accountPwLimiter);
app.use("/router/nouns/search", nodesSearchLimiter);
app.patch("/router/profile/nodesBelong", belongsPatchLimiter);  // only patch, spare GET (which is res belongs)


//parse url comeing in
app.use(bodyParser.json({limit: '20mb'}));//parse Content-Type: /json
app.use(bodyParser.raw({limit: "20mb"}));//parse Content-Type: /application/octet-stream
app.use(bodyParser.text({limit: '20mb'})); //parse Content-Type: /text, like pure base64 string in this project
app.use(bodyParser.urlencoded({extended: true}));


//establish the statics resources
app.use(express.static(path.join(__dirname+'/public')));
app.use(express.static(path.join(__dirname+'/public/ico'))); // for /favicon.ico


//api
app.use('/router', router)

app.use('/a', function(req, res){
  winston.info(`${"page: requesting for "} '${req.originalUrl }', ${req.method}, ${"from ip "}, ${req.ip}`);

  res.sendFile(path.join(__dirname+'/public/html/html_Service.html'), {headers: {'Content-Type': 'text/html'}}, function (err) {
    if (err) {
      throw err
    }
  });
})

app.use('/s', function(req, res){
  winston.info(`${"page: requesting for "} '${req.originalUrl }', ${req.method}, ${"from ip "}, ${req.ip}`);

  res.sendFile(path.join(__dirname+'/public/html/html_Sign.html'), {headers: {'Content-Type': 'text/html'}}, function (err) {
    if (err) {
      throw err
    }
  });
})

app.use('/self/profile', function(req, res){
  winston.info(`${"page: requesting for "} '${req.originalUrl }', ${req.method}, ${"from ip "}, ${req.ip}`);

  res.sendFile(path.join(__dirname+'/public/html/html_SelfFront.html'), {headers: {'Content-Type': 'text/html'}}, function (err) {
    if (err) {
      throw err
    }
  });
})

//then for the rest of path, including plain '/', we need to identify source and purpose
app.use('/', function(req, res, next){
  //identifing whether a crwlers or not (now only for path '/explore/unit')
  //to determine which html should be used
  winston.info(`${"page: requesting for Within under / "} '${req.originalUrl }', ${req.method}, ${"from ip "}, ${req.ip}, ${" identify crawler first."}`);

  const userAgent = req.headers['user-agent'] || false;

  if(userAgent && crawlersIdentify(userAgent)){ //is crawler, then pass the control to the next middleware
    //but NOTICE, here inside a .use() handler, different from .METHOD()
    //it just define the middleware, so
    //we have to return the next as a callback
    //ref:  https://github.com/expressjs/express/issues/2591
    return next();
  }else{ //not from crawler, so res with a regular client html
    //here serve the regular client html
    //the res & req cycle would complete by this way,
    //WOULD NOT call the next middleware under this path('/')
    res.sendFile(path.join(__dirname+'/public/html/html_Within.html'), {
      headers: {
        'Content-Type': 'text/html'
      },
    }, function (err) {
      if (err) {
        throw err
      }
    });
    if((req.path == "/cosmic/explore/unit") && (req.hostname != domain.name) ){ // and one more check, record the req if it was a Unit direct req
      let unitExposedId = req.query.unitId;
      // no need to wait async process, let it run itself
      _DB_units.findOne({
        where: {exposedId: unitExposedId}
      })
      .then((result)=>{
        if(!result) return; // null, no this Unit
        return _DB_unitsReqOrigin.findOne({
          where: {
            id_unit: result.id,
            prev_domain: req.hostname
          }
        })
        .then((resultReqOrigin)=>{
          if(resultReqOrigin){
            let nextCount = resultReqOrigin.reqCount +1;
            return _DB_unitsReqOrigin.update(
              {reqCount: nextCount},
              {where: {
                id_unit: result.id,
                prev_domain: req.hostname
              }}
            );
          }
          else {
            return _DB_unitsReqOrigin.create({
              id_unit: result.id,
              exposedId: result.exposedId,
              prev_domain: req.hostname
            });
          };
        }).catch((error)=> {throw error});
      })
      .catch((error)=>{
        winston.error(`${"Update statics to units_req_origin failed from url"} - ${req.originalUrl} - ${req.method} - ${req.ip} , Error: ${error}`);
      });
    };
  }
});
app.use('/', routerPathWithin);

const crawlersIdentify = (userAgent) => { //using userAgents list to identifing crawler
  let result = false;
  crawlers.forEach((obj, index)=>{
    if (RegExp(obj.pattern).test(userAgent)) {
      //we send the same file to all crawler/robot for now
      //so jut return the bool
        result = true;
    }
  })
  return result;
}


// initiate api server
app.listen(process.env.port || envBasic.port);
winston.warn("server initiating, running at Port "+envBasic.port);

// initiate mail timer
function intervalMarketMail(){
  winston.warn("mail timer initiating under production mode, setInterval to: 12 hours.");
  mailTimer(); // first time at init

  setInterval(()=>{
    winston.info("mail timer, loop processing.");
    mailTimer();
  }, 43200000) // every 12 hours. Nodejs could accept only integer < 2147483647 miliseconds
};
/*
temporaly cease mailTimer
if (process.env.NODE_ENV != 'development') intervalMarketMail(); */
