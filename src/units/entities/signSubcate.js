const express = require('express');
const execute = express.Router();
const winston = require('../../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_units = require('../../../db/models/index').units;
const _DB_paths = require('../../../db/models/index').paths;
const _DB_pathsSubcate = require('../../../db/models/index').paths_subcate;
const _DB_usersByFacebook = require('../../../db/models/index').users_by_facebook;
const _DB_unitsPathsSubdisSign = require('../../../db/models/index').units_paths_subdis_sign;
const {_res_success} = require('../../utils/resHandler.js');
const {
  _handle_ErrCatched,
  notFoundError
} = require('../../utils/reserrHandler.js');

async function _handle_GET_units_entitySign_list(req, res){
  const tokenId = req.extra.tokenify ? req.extra.tokenUserId : null; // userId passed from pass.js(no token is possible)
  const reqUnitExposed = req.query.unitId;

  try{
    // validation: if the unitId valid
    const targetUnit = await _DB_units.findOne({
      where: {
        exposedId: reqUnitExposed
      }
    });
    // if 'null' result -> not a valid pathName
    if(!targetUnit){ //'null'
      throw new notFoundError("Unit you request was not found. Please use a valid unit id.", 51);
      return; //stop and end the handler.
    };
    // validation: if the subCateId valid
    // (directly table <paths_subcate> because no other subCates yet)
    const desiredPath = await _DB_paths.findOne({
      where: {
        pathName: req.query.pathProjectName
      }
    });
    if(!desiredPath){ //'null'
      throw new notFoundError("Theme page you request was not found. Please use a valid one.", 52);
      return; //stop and end the handler.
    };

    const signedUnitsUsersData = await _DB_unitsPathsSubdisSign.findAll({
      where: {
        id_path: desiredPath.id,
        // id_subPath: desiredSubCate.id // we didn't currently match id_subPath for simple structure
        id_unit: targetUnit.id,
        userId_Identity: "facebook"
      }
    });
    const signedUsersList = signedUnitsUsersData.map((row, index)=>{
      return row.used_userId;
    });
    const signedUsersFbInfo = await _DB_usersByFacebook.findAll({
      where: {
        id_byFb: signedUsersList
      }
    });
    const resUsersFbInfo = signedUsersFbInfo.map((row, index)=>{
      return {
        name: row.fb_account,
        profilePicUrl: row.fb_profilePic
      }
    });

    let sendingData={
      signUsersArr: resUsersFbInfo,
      temp: {}
    };

    _res_success(res, sendingData, "GET: /units/entity, sign_subcate/list, complete.");
  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return;
  }
}

async function _handle_GET_units_entitySign_userSign(req, res){
  const tokenId = req.extra.tokenify ? req.extra.tokenUserId : null; // userId passed from pass.js(no token is possible)
  const reqUnitExposed = req.query.unitId;

  try{
    // validation: if the unitId valid
    const targetUnit = await _DB_units.findOne({
      where: {
        exposedId: reqUnitExposed
      }
    });
    // if 'null' result -> not a valid pathName
    if(!targetUnit){ //'null'
      throw new notFoundError("Unit you request was not found. Please use a valid unit id.", 51);
      return; //stop and end the handler.
    };
    // validation: if the subCateId valid
    // (directly table <paths_subcate> because no other subCates yet)
    const desiredPath = await _DB_paths.findOne({
      where: {
        pathName: req.query.pathProjectName
      }
    });
    if(!desiredPath){ //'null'
      throw new notFoundError("Theme page you request was not found. Please use a valid one.", 52);
      return; //stop and end the handler.
    };
    // select users data first
    const userFbInfo = await _DB_usersByFacebook.findOne({
      where: {
        fb_id: req.query.fbId
      }
    });

    let sendingData={
      signed: false,
      temp: {}
    };

    if(!userFbInfo){ // no record of this account before
      _res_success(res, sendingData, "GET: /units/entity, sign_subcate/usersign, complete.");
      return;
    };

    const signedUnitsUsersData = await _DB_unitsPathsSubdisSign.findOne({
      where: {
        id_path: desiredPath.id,
        // id_subPath: desiredSubCate.id // we didn't currently match id_subPath for simple structure
        id_unit: targetUnit.id,
        used_userId: userFbInfo.id_byFb
      }
    });

    if(signedUnitsUsersData){ // yes, there has been a record for this user.
      sendingData.signed = true;
    };

    _res_success(res, sendingData, "GET: /units/entity, sign_subcate/usersign, complete.");
  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return;
  }
}

async function _handle_POST_units_entitySign_userSign(req, res){
  const tokenId = req.extra.tokenify ? req.extra.tokenUserId : null; // userId passed from pass.js(no token is possible)
  const reqUnitExposed = req.body.unitId;

  try{
    // validation: if the unitId valid
    const targetUnit = await _DB_units.findOne({
      where: {
        exposedId: reqUnitExposed
      }
    });
    // if 'null' result -> not a valid pathName
    if(!targetUnit){ //'null'
      throw new notFoundError("Unit you request was not found. Please use a valid unit id.", 51);
      return; //stop and end the handler.
    };
    // validation: if the subCateId valid
    // (directly table <paths_subcate> because no other subCates yet)
    const desiredPath = await _DB_paths.findOne({
      where: {
        pathName: req.body.pathProjectName
      }
    });
    if(!desiredPath){ //'null'
      throw new notFoundError("Theme page you request was not found. Please use a valid one.", 52);
      return; //stop and end the handler.
    };
    // check if the users has built a record
    let userFbInfo = await _DB_usersByFacebook.findOne({
      where: {
        fb_id: req.body.fbId
      }
    });
    if(!userFbInfo){ // no record of this account before
      userFbInfo = await _DB_usersByFacebook.create({
        fb_id: req.body.fbId,
        fb_account: req.body.fbName,
        fb_email: req.body.fbEmail,
        fb_profilePic: req.body.fbProfilePicUrl
      })
      .then((createdUser)=>{ // .create() would return the newly create record
        return createdUser;
      });
    };
    // here, still select once to check if the users has already signed
    const signedUnitsUsersData = await _DB_unitsPathsSubdisSign.findOne({
      where: {
        id_path: desiredPath.id,
        // id_subPath: desiredSubCate.id // we didn't currently match id_subPath for simple structure
        id_unit: targetUnit.id,
        used_userId: userFbInfo.id_byFb
      }
    });

    let sendingData={
      temp: {}
    };

    if(signedUnitsUsersData){
      _res_success(res, sendingData, "POST: /units/entity, sign_subcate/usersign, complete.");
      return;
    };
    // after every check, insert the new record into the tb units_paths_subdis_sign
    const subcateInfo = await _DB_pathsSubcate.findOne({ // first, still select subCate info by exposedId pass in req
      where: {
        exposedId: req.body.subCateId
      }
    });
    await _DB_unitsPathsSubdisSign.create({
      id_unit: targetUnit.id,
      id_path: desiredPath.id,
      id_subPath: subcateInfo.id,
      used_userId: userFbInfo.id_byFb,
      userId_Identity: "facebook"
    });

    _res_success(res, sendingData, "POST: /units/entity, sign_subcate/usersign, complete.");
  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return;
  }
}

async function _handle_DELETE_units_entitySign_userSign(req, res){
  const tokenId = req.extra.tokenify ? req.extra.tokenUserId : null; // userId passed from pass.js(no token is possible)
  const reqUnitExposed = req.body.unitId;

  try{
    // validation: if the unitId valid
    const targetUnit = await _DB_units.findOne({
      where: {
        exposedId: reqUnitExposed
      }
    });
    // if 'null' result -> not a valid pathName
    if(!targetUnit){ //'null'
      throw new notFoundError("Unit you request was not found. Please use a valid unit id.", 51);
      return; //stop and end the handler.
    };
    // validation: if the subCateId valid
    // (directly table <paths_subcate> because no other subCates yet)
    const desiredPath = await _DB_paths.findOne({
      where: {
        pathName: req.body.pathProjectName
      }
    });
    if(!desiredPath){ //'null'
      throw new notFoundError("Theme page you request was not found. Please use a valid one.", 52);
      return; //stop and end the handler.
    };
    // check if the users has built a record
    let userFbInfo = await _DB_usersByFacebook.findOne({
      where: {
        fb_id: req.body.fbId
      }
    });
    if(!userFbInfo){ // no record of this account before
      throw new notFoundError("User by this Facebook ID was not found. Please use a valid one.", 50);
      return; //stop and end the handler.
    };
    // here, still select once to check if the users has already signed
    const signedUnitsUsersData = await _DB_unitsPathsSubdisSign.findOne({
      where: {
        id_path: desiredPath.id,
        // id_subPath: desiredSubCate.id // we didn't currently match id_subPath for simple structure
        id_unit: targetUnit.id,
        used_userId: userFbInfo.id_byFb
      }
    });
    if(!!signedUnitsUsersData){ // not "null"
      await _DB_unitsPathsSubdisSign.destroy({
        where: {
          id_path: desiredPath.id,
          // id_subPath: desiredSubCate.id // we didn't currently match id_subPath for simple structure
          id_unit: targetUnit.id,
          used_userId: userFbInfo.id_byFb
        }
      });
    };

    let sendingData={
      temp: {}
    };

    _res_success(res, sendingData, "DELETE: /units/entity, sign_subcate/usersign, complete.");
  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return;
  }
}

module.exports = {
  _handle_GET_units_entitySign_list,
  _handle_GET_units_entitySign_userSign,
  _handle_POST_units_entitySign_userSign,
  _handle_DELETE_units_entitySign_userSign,
};
