const express = require('express');
const execute = express.Router();
const path = require("path");
const winston = require('../../config/winston.js');
const projectRootPath = require("../../projectRootPath");
const {
    marketingImgs
} = require('../../config/path.js');
const {
  _handle_ErrCatched,
} = require('../utils/reserrHandler.js');

async function _handle_GET_imgfile(req, res){
    const reqFileName = req.params.filename;

  try{
      let imgPath = path.join(projectRootPath, marketingImgs, reqFileName);
      res.sendFile(imgPath, { headers: { 'Content-Type': 'image' } }, function (err) {
          if (err) {
              console.log('error occured: img sending fail:' + err);
              res.status(404).end();
          }
      });
  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return;
  }

}

execute.get('/:filename', function(req, res){
    if (process.env.NODE_ENV == 'development') winston.verbose(`GET: /img/file: ${req.params.filename}`);
    _handle_GET_imgfile(req, res);
})

module.exports = execute;
