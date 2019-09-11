const express = require('express');
const router = express.Router();

const winston = require('../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_nodesActivity = require('../../db/models/index').nodes_activity;
const _DB_lastvisitIndex = require('../../db/models/index').lastvisit_index;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
  forbbidenError
} = require('../utils/reserrHandler.js');

function _handle_crawler_GET_Unit(req, res){
  new Promise((resolve, reject)=>{
    //select Unit by id in query
    const unitId = req.query.unitId.toString(); //validate the query value trusted or not
    //remember using reject() to block the Promise immidiately.
    if(!Boolean(unitId)) reject(new forbbidenError("crawler req /unit without unitId.", 38));

    //if safe, then we select the requested Unit & res html with Unit info

    return _DB_lastvisitIndex.findOne({
      where: {
        id_user: userId
      },
      attributes: ['updatedAt', 'createdAt', 'id_user']
    }).then((selected)=>{
      let sendingData={
        greet: '',
        temp: {}
      };

      if(selected.createdAt== req.query.lastVisit){
        //only possible at first time after registration
        sendingData.greet = 'welcomeNew'
      }else{
        let date = new Date();
        let currentCourse = date.getHours();

        if(currentCourse> 17) sendingData.greet = 'greetNight'
        else if(currentCourse> 6 && currentCourse< 11) sendingData.greet = 'greetMorning'
        else sendingData.greet = 'welcomeBack';
      }

      resolve(sendingData);
    }).catch((err)=>{
      reject(new internalError(err, 131));
    });
  }).then((sendingData)=>{
    _res_success(res, sendingData, "from crawler, GET: "+req.originalUrl+", completed.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

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
  const variable= { //create local variable as value used in template
    title: "Cornerth.",
    descrip: "Uncover what behind.",
    ogurl: req.originalUrl,
    ogimg: "" //replace to page icon in the future
  }

  res.render(path.join(__dirname+'/public/html/ren_crawler.pug', variable);
})

module.exports = router;
