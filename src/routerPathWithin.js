const express = require('express');
const router = express.Router();

const path = require("path");
const crawlers = require('crawler-user-agents');

const winston = require('../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_units = require('../db/models/index').units;
const {_res_success} = require('./utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
  forbbidenError
} = require('./utils/reserrHandler.js');

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

function _handle_crawler_GET_Unit(req, res){
  new Promise((resolve, reject)=>{
    //select Unit by id in query
    const unitId = req.query.unitId.toString(); //validate the query value trusted or not
    //remember using reject() to block the Promise immidiately.
    if(!Boolean(unitId)) reject(new forbbidenError("crawler req /unit without unitId.", 38));

    //if safe, then we select the requested Unit & res html with Unit info
    return _DB_units.findByPk(unitId).then((unit)=>{
      let variables= { //create local variables as value used in template
        title: "Cornerth.",
        descrip: "this is descrip",
        ogurl: req.originalUrl,
        ogimg: 'router/img/'+unit.url_pic_layer0+'?type=thumb'
      }

      resolve(variables);
    }).catch((err)=>{
      reject(new internalError(err, 131));
    });
  }).then((variables)=>{
    //res html directly from templte modified by variables
    res.render(path.join(__dirname+'/public/html/ren_crawler.pug'), variables);
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}


router.use(function(req, res, next){
  winston.info(`${"page: requesting for Within under / "} '${req.originalUrl }', ${req.method}, ${"from ip "}, ${req.ip}, ${" identify crawler first."}`);

  //identifing is a crwlers (now only for path '/explore/unit')
  //to determine which html should be used
  const userAgent = req.headers['user-agent'] || false;

  if(userAgent && crawlersIdentify(userAgent)){
    //is crawler, then pass the control to the next middleware
    next();
  }else next('route'); //not from crawler, so res with a regular client html by going to the next route

}, function(req, res){
  //here serve the regular client html
  res.sendFile(path.join(__dirname+'../public/html/html_Within.html'), {headers: {'Content-Type': 'text/html'}}, function (err) {
    if (err) {
      throw err
    }
  });
})


//res specific Unit info to crawler
router.use('/cosmic/explore/unit', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose(`${'from crawler, GET: '} ${req.originalUrl}`);
  //to res dynamic html to crawler, we need to select Unit basic info from DB
  _handle_crawler_GET_Unit(req, res);
})

//res common data to crawler if no specific destination,
//must at the last to assure filtering by any specific path above
router.use('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose(`${'from crawler, GET: '} ${req.originalUrl}`);
  const variables= { //create local variable as value used in template
    title: "Cornerth.",
    descrip: "Uncover what behind.",
    ogurl: req.originalUrl,
    ogimg: "" //replace to page icon in the future
  }

  res.render(path.join(__dirname+'../public/html/ren_crawler.pug'), variables);
})

module.exports = router;
