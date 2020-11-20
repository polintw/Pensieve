const express = require('express');
const execute = express.Router();
const fetch = require('node-fetch');
const { getMetadata } = require('page-metadata-parser');
const domino = require('domino');

const winston = require('../../config/winston.js');
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
} = require('../utils/reserrHandler.js');

async function _handle_parser_urlmeta_GET(req, res){
    const reqClientUrl = typeof (req.body.clientUrl) == "string" ? req.body.clientUrl : '';

    try{
        const response = await fetch(reqClientUrl);
        const html = await response.text();
        const doc = domino.createWindow(html).document;
        const metadata = getMetadata(doc, reqClientUrl);
        let sendingData={  
            metadata:{},
            temp: {}
          };
        
        if(metadata) sendingData.metadata['metaTitle'] = metadata.title;
          
        _res_success(res, sendingData, "GET: parser: /urlmeta, complete.");
    }
    catch(error){
        _handle_ErrCatched(error, req, res);
    }
}

execute.post('/urlmeta', function(req, res){
    if (process.env.NODE_ENV == 'development') winston.verbose('GET parser: /urlmeta.');
  _handle_parser_urlmeta_GET(req, res);
})

module.exports = execute;
