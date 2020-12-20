const express = require('express');
const execute = express.Router();
const sharp = require('sharp');
//const ExifImage = require('exif').ExifImage;
const exifr = require('exifr');
const winston = require('../../config/winston.js');
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
} = require('../utils/reserrHandler.js');

async function _handle_img_resize_POST(req, res){
  //this is an api only for image resizing.
  //Notice!! this api do not receive any identity check at any point.

  let sendingData={
    resizedURL: "",
    temp: {}
  };
  let base64Splice = req.body.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  let base64Buffer = new Buffer.from(base64Splice[2], 'base64');
  if(!!req.query.exif){
    if (process.env.NODE_ENV == 'development') winston.verbose('POST: /img/resize, has "exif" in query. ');
    try{
      /*
      new ExifImage({ image: base64Buffer }, function (error, exifData) {
        if (error){
          winston.error('POST: /img/resize, has "exif" in query, has error: ', error);
          sendingData['exif'] = {};
        }
        else
          if (process.env.NODE_ENV == 'development') winston.verbose('POST: /img/resize, has "exif" in query, successfully processed. ');
          sendingData['exif'] = {
            gps: exifData.gps
          };
      });*/
      let { latitude, longitude } = await exifr.gps(base64Buffer);
      sendingData['exif'] = {
        gps: { 
          latitude: latitude,
          longitude: longitude 
        }
      };
    }
    catch (error) {
      winston.error('POST: /img/resize, has "exif" in query, error catched: ', error);
    }
  }

  sharp(base64Buffer)
      .rotate()
      .resize({width: 1920, height: 1920, fit: 'inside'})  // px, define it to FHD 1920 x 1080
      .jpeg({
          quality: 64
        })
      .toBuffer({ resolveWithObject: true })
      .then(({data, info})=>{
        console.log("outputFormat: "+info.format+", outputSize: "+info.size);
        let imgBase64 = new Buffer.from(data, 'binary').toString('base64');
        sendingData.resizedURL = 'data:image/jpeg;base64,' + imgBase64;

        return sendingData;
      }).then((sendingData)=>{
        _res_success(res, sendingData, "Complete, POST: /img/resize.");
      }).catch((err)=>{
        let error  = new internalError(err, 131);
        _handle_ErrCatched(error, req, res);
      });
}

execute.post('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('POST: /img/resize ');
  _handle_img_resize_POST(req, res);
})

module.exports = execute;
