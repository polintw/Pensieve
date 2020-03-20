const express = require('express');
const router = express.Router();

const path = require("path");
const {convertToRaw, convertFromRaw} = require ('draft-js');

const {envServiceGeneral} = require('../config/.env.json');
const winston = require('../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_units = require('../db/models/index').units;
const _DB_nouns = require('../db/models/index').nouns;
const _DB_marks = require('../db/models/index').marks;
const _DB_attribution = require('../db/models/index').attribution;
const projectRootPath = require('../projectRootPath');
const {_res_success} = require('./utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
  forbbidenError
} = require('./utils/reserrHandler.js');

async function _handle_crawler_GET_Unit(req, res){
  //select Unit by id in query
  //already validate before pass to this handler
  const exposedId = req.query.unitId;
  let unitId, url_pic_layer0, url_pic_layer1, authorId;
  unitId = url_pic_layer0 = url_pic_layer1 = authorId = false; //a 'lazy assign', not official
  await _DB_units.findOne({ where: { exposedId: exposedId } })
    .then((result) => {
      if (!!result) {
        unitId = result.id;
        url_pic_layer0 = result.url_pic_layer0;
        url_pic_layer1 = result.url_pic_layer1;
        authorId = result.id_author;
      }
    });

  if (!unitId || !url_pic_layer0) { //if the unit not 'existed'
    _handle_ErrCatched(new validationError("from _handle_crawler_GET_Unit, the req unit not exist.", 325), req, res);
    return; //stop and end the handler.
  }


  //the selection start from info about & nodes used by this Unit
  new Promise((resolve, reject)=>{
    let conditionsAttri = {
      where: { id_unit: unitId},
      attributes: ['id_noun']
    };
    _DB_attribution.findAll(conditionsAttri)
    .then((resultsAttri)=>{

      let variables= { //create local variables as value used in template
        title: [], //set array fisrt, will be mdified to string later before res
        descrip: "",
        ogurl: req.originalUrl,
        ogimg: 'https://'+envServiceGeneral.appDomain+'/router/img/'+url_pic_layer0+'?type=thumb' //don't forget using absolute path for dear crawler
      };
      //put the nodes used list into title
      variables.title = resultsAttri.map((row, index)=>{
        return row.id_noun
      })

      resolve(variables);
    }).catch((err)=>{
      reject(new internalError(err, 131));
    });
  }).then((variables)=>{
    //then because we compose title from nodes, description from mark
    //we select them by id we selected
    let conditionsMarks = {
      where: {id_unit: unitId},
      attributes: ['id', 'layer', 'serial', 'createdAt']
    };
    let nodesSelection = Promise.resolve(_DB_nouns.findAll({where: {id: variables.title}}).catch((err)=>{throw err}));
    let marksSelection = Promise.resolve(_DB_marks.findAll(conditionsMarks).catch((err)=>{throw err}));

    return Promise.all([nodesSelection, marksSelection]).then((resultsSelect)=>{
      let resultsNodes = resultsSelect[0],
      resultsMarks = resultsSelect[1],
      titleStr = "",
      description= "";

      //compose title from Nodes used
      resultsNodes.forEach((row, index)=>{
        if(index< 1){ titleStr += (row.name); return } //avoid ":" at the begining
        titleStr += (": "+row.name);
      });
      variables.title = titleStr;

      //then retrieve the first block of the first Mark
      /*
      the editor_content has shift to table marks_content, need a magnificent update if really want to display these data
      */
      //description = convertFromRaw(JSON.parse(resultsMarks[0].editor_content)).getFirstBlock().getText();
      //variables.descrip = description;  //for now, only use the first block of first mark as description


      return variables;
    }).catch((err)=>{
      throw new internalError(err, 131);
    });
  }).then((variables)=>{
    //res html directly from templte modified by variables
    res.render(path.join(projectRootPath, '/public/html/ren_crawler.pug'), variables);
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}


//route pass from parent start from here

//res specific Unit info to crawler
router.use('/cosmic/explore/unit', function(req, res, next){
  if(process.env.NODE_ENV == 'development') winston.verbose(`${'from crawler, GET: '} ${req.originalUrl}`);
  //to res dynamic html to crawler, we need to select Unit basic info from DB
  //validate the query value trusted or not
  //pass to general middleware if the id was unclear
  if(!Boolean(req.query.unitId.toString()) ) { next();}
  //if safe, then we select the requested Unit & res html with Unit info
  else _handle_crawler_GET_Unit(req, res);
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

  res.render(path.join(projectRootPath, '/public/html/ren_crawler.pug'), variables);
})

module.exports = router;
