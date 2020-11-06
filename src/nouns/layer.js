const express = require('express');
const execute = express.Router();
const winston = require('../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_nouns = require('../../db/models/index').nouns;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  notFoundError
} = require('../utils/reserrHandler.js');

async function _handle_GET_nouns_layerChildren(req, res){
  const reqBaseNode = req.query.baseNode;

  try{
    const infoBaseNode = await _DB_nouns.findOne({
      where: {id: reqBaseNode}
    });
    // if 'null' result -> not a valid pathName
    if(!infoBaseNode || !infoBaseNode.parent){ //'null' or no children, not an error, res an empty list
      let sendingData={
        nodesList: [],
        nodeParent: null,
        temp: {}
      };
      _res_success(res, sendingData, "GET: /nouns/layer, complete.");
      return; //stop and end the handler.
    };

    let childrenLayerSelection = await _DB_nouns.findAll({
      where: {
        category: infoBaseNode.category,
        language: infoBaseNode.language,
        parent_id: reqBaseNode
      }
    });

    let sendingData={
      nodesList: [],
      nodeParent: reqBaseNode,
      temp: {}
    };

    let listNodes = childrenLayerSelection.map((row, index)=>{
      return row.id
    });
    sendingData.nodesList = listNodes;

    _res_success(res, sendingData, "GET: /nouns/layer, complete.");
  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return;
  }

}

async function _handle_GET_nouns_layer(req, res){
  const reqBaseNode = req.query.baseNode;

  try{
    const infoBaseNode = await _DB_nouns.findOne({
      where: {id: reqBaseNode}
    });
    // if 'null' result -> not a valid pathName
    if(!infoBaseNode){ //'null', not an error, res an empty list
      let sendingData={
        nodesList: [],
        nodeParent: null,
        temp: {}
      };
      _res_success(res, sendingData, "GET: /nouns/layer, complete.");
      return; //stop and end the handler.
    };

    const parentNodeId = infoBaseNode.parent_id;
    let sameLayerSelection = [];
    if(!parentNodeId){ // no parent, means the req node was at the highest class
      sameLayerSelection = await _DB_nouns.findAll({
        where: {
          category: infoBaseNode.category,
          language: infoBaseNode.language,
          child: 0,
        }
      });
    }
    else{
      sameLayerSelection = await _DB_nouns.findAll({
        where: {
          category: infoBaseNode.category,
          language: infoBaseNode.language,
          parent_id: infoBaseNode.parent_id
        }
      });
    }

    let sendingData={
      nodesList: [],
      nodeParent: null,
      temp: {}
    };

    let listNodes = sameLayerSelection.map((row, index)=>{
      return row.id
    });
    sendingData.nodesList = listNodes;
    sendingData.nodeParent = infoBaseNode.parent_id;

    _res_success(res, sendingData, "GET: /nouns/layer, complete.");
  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return;
  }

}

execute.get('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /nouns/layer ');
  const reqAsParent = (req.query.asParent=="true") ? true : false; // req.query.asParent was a string when passed to server
  if(reqAsParent){
    _handle_GET_nouns_layerChildren(req, res);
  }
  else{
    _handle_GET_nouns_layer(req, res);
  }
})

module.exports = execute;
