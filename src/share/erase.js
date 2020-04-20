const express = require('express');
const execute = express.Router();
const fs = require('fs');
const path = require("path");
const projectRootPath = require("../../projectRootPath");
const winston = require('../../config/winston.js');
const {
  userImg
} = require('../../config/path.js');
const _DB_units = require('../../db/models/index').units;
const _DB_marks = require('../../db/models/index').marks;
const _DB_marksContent = require('../../db/models/index').marks_content;
const _DB_attribution = require('../../db/models/index').attribution;
const _DB_responds = require('../../db/models/index').responds;
const _DB_units_nodesAssign = require('../../db/models/index').units_nodes_assign;

const {
  _handle_ErrCatched,
  forbbidenError,
  internalError,
  validationError
} = require('../utils/reserrHandler.js');
const {
  _res_success
} = require('../utils/resHandler.js');


async function _handle_PATCH_sharedErase(req, res){

  const userId = req.extra.tokenUserId; //use userId passed from pass.js
  const exposedId = req.reqUnitId; //in editing by author, the unit was created so did the unitId
  let unitId, url_pic_layer0, url_pic_layer1, authorId;
  unitId= url_pic_layer0= url_pic_layer1= authorId =false; //a 'lazy assign', not official
  await _DB_units.findOne({where: {exposedId: exposedId}})
    .then((result)=>{
      if(!!result){
        unitId = result.id;
        url_pic_layer0 = result.url_pic_layer0;
        url_pic_layer1 = result.url_pic_layer1;
        authorId = result.id_author;
      }
    });

  //first, check validation
  if(authorId != userId){ //if the user are the author?
    _handle_ErrCatched(new forbbidenError("from _handle_PATCH_sharedErase, erase Shared but the user is not the author.", 39), req, res);
    return; //stop and end the handler.
  }
  else if(!unitId || !url_pic_layer0){ //if the unit really 'existed'
    _handle_ErrCatched(new validationError("from _handle_PATCH_sharedErase, erase Shared but the unit not exist.", 325), req, res);
    return; //stop and end the handler.
  }

  //then, we can start erase process
  new Promise((resolve, reject)=>{
    //first cleaning out the imgs
    fs.unlink(path.join(projectRootPath, userImg+url_pic_layer0), function(err){
      if(err) {
        reject(new internalError(err ,131));
        return;
      };
      //delete beneath as well --- if any
      if(!!url_pic_layer1){
        fs.unlink(path.join(projectRootPath, userImg+url_pic_layer1), function(err){
          if(err) {
            reject(new internalError(err ,131));
            return;
          };
          resolve();
        });
      }else{
        resolve();
      }
    })
  }).then(()=>{
    const destroyUnits = ()=>{ //paranoid
      return _DB_units.destroy({where: {id: unitId}})
      .catch((err)=>{throw err});
    };
    const destroyMarks = ()=>{ //paranoid
      return _DB_marks.destroy({where: {id_unit: unitId}})
      .catch((err)=>{throw err});
    };
    const destroyMarksContent = ()=>{ //paranoid
      return _DB_marksContent.destroy({where: {id_unit: unitId}})
      .catch((err)=>{throw err});
    };
    const destroyAttri = ()=>{ //paranoid
      return _DB_attribution.destroy({where: {id_unit: unitId}})
      .catch((err)=>{throw err});
    };
    const destroyRespond = ()=>{ //could not recover
      return _DB_responds.destroy({where: {id_unit: unitId}})
      .catch((err)=>{throw err});
    };
    const destroyUnitsNodeAss = ()=>{ //could not recover
      return _DB_units_nodesAssign.destroy({where: {id_unit: unitId}})
      .catch((err)=>{throw err});
    };

    return Promise.all([
      new Promise((resolve, reject)=>{destroyUnits().then(()=>{resolve();});}),
      new Promise((resolve, reject)=>{destroyMarks().then(()=>{resolve();});}),
      new Promise((resolve, reject)=>{destroyMarksContent().then(()=>{resolve();});}),
      new Promise((resolve, reject)=>{destroyAttri().then(()=>{resolve();});}),
      new Promise((resolve, reject)=>{destroyUnitsNodeAss().then(()=>{resolve();});})
    ])
    .then(()=>{
      return ;
    })
    .catch((err)=>{
      throw new internalError("from _handle_PATCH_sharedErase, unexpect error, "+err, 131);
    })

  }).then(()=>{
    //every essential step for a shared has been done
    _res_success(res, {}, '');

  })
  .catch((error)=>{
    //a catch here, shut the process if the error happened in the 'front' steps
    _handle_ErrCatched(error, req, res);
  });

}

execute.patch('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('PATCH: share/erase');
  _handle_PATCH_sharedErase(req, res);
})

module.exports = execute
