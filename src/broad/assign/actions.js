const express = require('express');
const execute = express.Router();

const winston = require('../../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_broads = require('../../../db/models/index').broads;
const _DB_units = require('../../../db/models/index').units;
const {_res_success} = require('../../utils/resHandler.js');
const {
  _handle_ErrCatched,
  internalError,
  forbbidenError
} = require('../../utils/reserrHandler.js');

function _handle_POST_broad(req, res){
  new Promise((resolve, reject)=>{
    const userId = req.extra.tokenUserId;

    const reqUnitId = req.reqUnitId; //unit we now focus on
    //in this api, we need to check:
    //if the user is author, if so, block it
    //if the records already there, if so, res success directly
    _DB_units.findOne({
      where:{id: reqUnitId}
    })
    .then((resultUnit)=> {
      if(resultUnit.id_author == userId) throw {defined:true, instance: (new forbbidenError('reject by broad, trying to broad own Shared.', 37))};
    })
    .then(()=>{
      return _DB_broads.findOne({ //check if the records already there, in case some err or any malicious req
        where: {id_unit: reqUnitId, id_user: userId}
      })
      .then((resultBroad)=>{
        if(!!resultBroad){ //result is not null, meaning there is already a record
          throw {defined: true, instance: (new forbbidenError('reject by broad, trying to insert a duplicated records.', 87))};
        }
        else return; //end of 'if'
      });
    })
    .then(()=>{
      //then, we insert the record if everything is fine
      return _DB_broads.create( //create the records directly
        {id_unit: reqUnitId, id_user: userId}
      )
    })
    .then((resultReturn)=>{

      //should update 'notifications' here, after the records create

      resolve();
    }).catch((err)=>{
      if(err.defined){
        reject(err.instance);
      }
      else reject(new internalError(err, 131));
    });

  }).then(()=>{
    let sendingData ={
      temp:{}
    }
    _res_success(res, sendingData, "POST: /broad, post actions , complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

function _handle_PATCH_broad(req, res){
  new Promise((resolve, reject)=>{
    const userId = req.extra.tokenUserId;

    const reqUnitId = req.reqUnitId; //unit we now focus on
    //in this api, no need to check anything,
    //go direct, nothing would happend if there was not any existed record.
    _DB_broads.destroy({ //it would be a 'soft' delete -- could be restore because only set 'deletedAt'
      where: {id_unit: reqUnitId, id_user: userId}
    })
    .then((resultReturn)=>{

      //should update 'notifications' here, after confirmation

      resolve();
    }).catch((err)=>{
      reject(new internalError(err, 131));
    });

  }).then(()=>{
    let sendingData ={
      temp:{}
    }
    _res_success(res, sendingData, "PATCH: /broad, patch(delete) actions , complete.");
  }).catch((error)=>{
    _handle_ErrCatched(error, req, res);
  });
}

module.exports = {
  _handle_POST_broad,
  _handle_PATCH_broad
};
