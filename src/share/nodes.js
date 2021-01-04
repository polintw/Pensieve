const express = require('express');
const execute = express.Router();
const winston = require('../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_attri = require('../../db/models/index').attribution;
const _DB_paths = require('../../db/models/index').paths;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  notFoundError
} = require('../utils/reserrHandler.js');

async function _handle_GET_shareds_NodesAssigned(req, res){
  const userId = req.extra.tokenUserId; //use userId passed from pass.js
  const reqPathProject = !!req.query.pathProject ? req.query.pathProject : false; // id of pathProject or 'undefined'

  try{
    let pathInfo = '';
    if(reqPathProject){
      pathInfo = await _DB_paths.findOne({
        where: {pathName: reqPathProject}
      });
      // if 'null' result -> not a valid pathName
      if(!pathInfo){ //'null'
        throw new notFoundError("Project you request was not found. Only a valid path name was allowed.", 52);
        return; //stop and end the handler.
      };
    };
    // select latest unit to each node from table nouns
    let whereAttributes = reqPathProject ? ({
      id_author: userId,
      used_authorId: pathInfo.id,
      author_identity: "pathProject"
    }) : ({
        id_author: userId,
        used_authorId: null,
        author_identity: "user"
    });
    let nodesByAttri = await _DB_attri.findAll({
      where: whereAttributes,
      attributes: [
        //'max' here combined with 'group' prop beneath,
        //because the GROUP by would fail when the 'createdAt' is different between each row,
        //so we ask only the 'max' one by this method
        [Sequelize.fn('max', Sequelize.col('createdAt')), 'createdAt'], //fn(function, col, alias)
        //set attributes, so we also need to call every col we need
        'id_noun',
      ],
      group: 'id_noun' //Important. means we combined the rows by node, each id_noun would only has one row
    });
    if (!!req.query.suggestion && nodesByAttri.length > 7) { // if we are return list for suggestions used in NavFIlter, only return
      function FisherShuffle(array) {
        /* from: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array */
        let currentIndex = array.length, temporaryValue, randomIndex;

        while (0 !== currentIndex) {
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;

          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }

        return array;
      }

      nodesByAttri = FisherShuffle(nodesByAttri);
      nodesByAttri = nodesByAttri.slice(0, 7); // only index 0~6, total 7 elements
    };

    let nodesList = nodesByAttri.map((row, index)=>{
      return row.id_noun;
    })

    let sendingData={
      nodesList: nodesList,
      temp: {}
    };

    _res_success(res, sendingData, "GET: /shareds/nodes, /assigned , complete.");
  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return;
  }

}

execute.get('/assigned', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /shareds/nodes, /assigned ');
  _handle_GET_shareds_NodesAssigned(req, res);
})

module.exports = execute;
