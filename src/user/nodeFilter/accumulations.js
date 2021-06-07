const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_units = require('../../../db/models/index').units;
const _DB_paths = require('../../../db/models/index').paths;
const _DB_attri = require('../../../db/models/index').attribution;
const _DB_inspireds = require('../../..//db/models/index').inspireds;
const {_res_success} = require('../../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
} = require('../../utils/reserrHandler.js');

async function _handle_GET_accumulations_mixfeed(req, res){
  const userId = req.extra.tokenUserId; //use userId passed from pass.js

  try {
    //now, we to prepared created time of last Unit res to client in last req.
    //but it is possible, the 'date' in query are not a 'date', and param from query could only be parse as 'string', we need to turn it into time
    let unitBase = new Date(req.query.listUnitBase);
    const lastUnitTime = !isNaN(unitBase) ? unitBase : new Date(); // basically, undefined listUnitBase means first landing to the page
    // by query, see if we got a filter node
    const reqFilterNodes = req.query.filterNodes; // is an array contain one to several nodes id
    const reqListLimit = !isNaN(parseInt(req.query.limit)) ? parseInt(req.query.limit) : 8; // list length limit or 'undefined'
    const reqPathProject = !!req.query.pathProject ? req.query.pathProject : false; // id of pathProject or 'undefined'
    const reqCategories =  !!req.query.mixCategory ? req.query.mixCategory : []; // categories client req
    // judge the 'range' we are going to pick, uf pathProject or if mixIdentity
    let whereRange = 'personalOnly';
    if(reqPathProject) whereRange = 'pathProjectOnly';
    // first, pick path info if request for path project
    let pathInfo = '';
    if(reqPathProject){
      pathInfo = await _DB_paths.findOne({
        where: {pathName: reqPathProject}
      });
      // and allow 'null', would just select nothing
    };

    // units id list res to client at final
    let unitsExposedList = [], notesOnlyExposedList= [];
    // select the 'inspired' units if not req for pathProject
    let inspiredUnits = [];
    if(!reqPathProject){
      let inspiredSelection = await _DB_inspireds.findAll({
        where: {
          id_user: userId,
          createdAt: { [Op.lt]: lastUnitTime },
        },
        include: { //this is worked by comprehensive setting for 'association' --- foreign key between 2 including table(even a foreign key to self )
          model: _DB_attri,
          // INNER JOIN, no 'required' set
          where: {
            id_noun: reqFilterNodes
          }
        },
        limit: reqListLimit,
      });
      inspiredUnits = inspiredSelection.map((row, index)=>{
        return row.id_unit;
      });
    };
    // select the users' notes
    let unitsByAttri = await _DB_attri.findAll({
      where: {
        id_author: userId,
        author_identity: (whereRange == "pathProjectOnly" ? "pathProject" : "user"),
        used_authorId: (whereRange == "pathProjectOnly" ? pathInfo.id : null),
        id_noun: reqFilterNodes,
        createdAt: { [Op.lt]: lastUnitTime },
      },
      attributes: [
        //'max' here combined with 'group' prop beneath,
        //because the GROUP by would fail when the 'createdAt' is different between each row,
        //so we ask only the 'max' one by this method
        [Sequelize.fn('max', Sequelize.col('createdAt')), 'createdAt'], //fn(function, col, alias)
        //set attributes, so we also need to call every col we need
        'id_unit',
      ],
      group: 'id_unit', //Important. means we combined the rows by unit
      order: [ //make sure the order of arr are from latest
        Sequelize.literal('`createdAt` DESC') //and here, using 'literal' is due to some wierd behavior of sequelize,
      ],
      limit: reqListLimit,
    })
      .catch((err) => { throw new internalError(err, 131); });
    let unitsId = unitsByAttri.map((row, index) => {
      return row.id_unit;
    });
    // mix the 2 selected results above by the categories client req
    let unitsMixList = [];
    for(let i =0; (i< 2 && i< reqCategories.length); i++ ){
      let targetResult = (reqCategories[i]=="inspired") ? inspiredUnits : unitsId;
      unitsMixList = unitsMixList.concat(targetResult);
    };

    unitsExposedList = await _DB_units.findAll({
      where: {
        id: unitsMixList,
        source: null,
      },
      order: [ //make sure the order of arr are from latest
        Sequelize.literal('`createdAt` DESC')
      ]
    })
    .then((results) => {
      // now, we only took the first '8' or reqListLimit
      let exposedIdlist = [];
      for(let i=0; (i < results.length && i < reqListLimit) ; i++){
        exposedIdlist.push(results[i].exposedId);
        if( unitsId.indexOf(results[i].id) >= 0 ) notesOnlyExposedList.push(results[i].exposedId);
      };
      return exposedIdlist;
    })
    .catch((err) => { throw new internalError(err, 131); });

    let sendingData = {
      unitsList: [],
      notesList: [], // user's own notes
      scrolled: true, // true if theere is any qualified Unit not yet res
      temp: {}
    };

    if (unitsExposedList.length < reqListLimit) sendingData.scrolled = false;
    sendingData.unitsList = unitsExposedList;
    sendingData.notesList = notesOnlyExposedList;

    _res_success(res, sendingData, "GET: /nodefilter/accumulations, mixfeed, complete.");

  }
  catch (error) {
    _handle_ErrCatched(error, req, res);
    return;
  }
}

execute.get('/mixfeed', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /nodefilter/accumulations, mixfeed. ');
  _handle_GET_accumulations_mixfeed(req, res);
})

module.exports = execute;
