const Jimp = require('jimp');
const Validator = require('validator');
const isEmpty = require('../../utils/isEmpty');
const {
  forbbidenError,
  internalError,
  notFoundError,
  validationError
} = require('../../utils/reserrHandler.js');
const _DB_users = require('../../../db/models/index').users;

async function _get_ancestors(userId){
  const userHomeland = await _DB_usersNodesHomeland.findOne({
    where: {
      id_user: userId,
      historyify: false
    }
  })
  .then((result)=>{
    return !!result ? result: false;
  })
  .catch((err)=>{
    throw new internalError("from _DB_usersNodesHomeland selection shareHandler_POST, "+err, 131)});
  const userResidence = await _DB_usersNodesResidence.findOne({
    where: {
      id_user: userId,
      historyify: false
    }
  })
  .then((result)=>{
    return !!result ? result: false;
  })
  .catch((err)=>{
    throw new internalError("from _DB_usersNodesResidence selection shareHandler_POST, "+err, 131);});

  let ancestorsByType = {};
  let belongList = [], belongsToType={}; //list used to select from assign, would incl. parent of belong nodes.
  if(!!userResidence){ belongList.push(userResidence.id_node); belongsToType[userResidence.id_node]= "residence"};
  if(!!userHomeland){ belongList.push(userHomeland.id_node);  belongsToType[userHomeland.id_node]= 'homeland'};
  // build a check point to block action without belong setting first .
  if(belongList.length < 1) throw new forbbidenError("Please, submit your Shared only after set a corner you belong to.", 120);

  const ancestorsInfo = await selectNodesParent(belongList);
  belongList.forEach((nodeId, index)=>{ //loop by list client sent
    let type = belongsToType[nodeId];
    if(nodeId in ancestorsInfo){
      let selfInclList = [], currentNode=ancestorsInfo[nodeId].id;
      while (!!currentNode) { //jump out until the currentNode was "null" or 'undefined'
        selfInclList.push(currentNode);
        currentNode = ancestorsInfo[currentNode].parent_id;
      }
      ancestorsByType[type] = selfInclList;
    }else ancestorsByType[type] = [nodeId];
  });

  return ancestorsByType;
}

async function validateShared(modifiedBody, userId) {

  // checking is the author really exist
  const userInfo = await _DB_users.findOne({
    where: {id: userId}
  });
  if(!userInfo){ //null, means no user found
    throw new notFoundError("You are not an allowed author.", 50); 
    return;
  }

  // checking is the img valid
  let coverBase64Buffer, beneathBase64Buffer;
  let coverBase64Splice = modifiedBody.coverBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/), beneathBase64Splice;
  if (!!modifiedBody.beneathBase64) beneathBase64Splice = modifiedBody.beneathBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

  coverBase64Buffer = Buffer.from(coverBase64Splice[2], 'base64');
  if (!!modifiedBody.beneathBase64) beneathBase64Buffer = Buffer.from(beneathBase64Splice[2], 'base64');

  const coverImg = await Jimp.read(coverBase64Buffer);
  const beneathImg = await Jimp.read(beneathBase64Buffer);
  if (coverImg.bitmap.width <= 0 || img.bitmap.height <= 0) { //do not make a img
    throw new forbbidenError("You didn't submit with an valid img.", 123);
    return;
  }
  if (!!modifiedBody.beneathBase64){
    if (beneathImg.bitmap.width <= 0 || beneathImg.bitmap.height <= 0) { //do not make a img
      throw new forbbidenError("You didn't submit with an valid img.", 123);
      return;
    }
  } 

  // checking the markObj passed in joinedMarks {reasonable portion_top, portion_left, layer & serial}
  const marksKeys = Object.keys(modifiedBody.joinedMarks);
  // compare list to data obj
  const marksObjConfirm = modifiedBody.every((markKey, index) => { return markKey in modifiedBody.joinedMarks});
  // deeper to data format
  const marksDataConfirm = marksKeys.every((key, index)=>{
    //first, we do not allow more than 1 mark in a Unit
    if(index > 0) return false;
    
    const obj = !isEmpty(modifiedBody.joinedMarks[key]) ? modifiedBody.joinedMarks[key] : {};
    if(!('editorContent' in obj) || !('layer' in obj) || !('portion_left' in obj) || !('portion_top' in obj) || ("serial" in obj)) return false; //block here
    // check, length of every property except 'blocks' in 'editorContent' not longer than limit
    if(
      obj['layer'] != 0 || // now only 1 im was allowed
      !Validator.isFloat(obj['portion_left'], {min: 0, max: 100}) ||
      !Validator.isFloat(obj['portion_top'], { min: 0, max: 100 }) ||
      !Validator.isInt((obj['portion_top'], {min: 0, max: 0})) // now only 1 mark is allowed
    ) return false;

    //then, check if editorContent has required format
    const contentObj = !isEmpty(obj['editorContent']) ? obj['editorContent'] : {};    
    if (!('entityMap' in contentObj) ||  ("blocks" in contentObj)) return false; //block here
    // check if an editor blocks is an array
    let objBlocksArrify = Array.isArray(contentObj['blocks']);
    if(!objBlocksArrify) return false;
    // start checking if the marks has limit characters in content
    //under condition: length limit 4095 for text_byBlocks in marks_content
    let blockLigntening = [],
      textByBlocks = {},
      inlineStyleRangesByBlocks = {},
      entityRangesByBlocks = {},
      dataByBlocks = {};

    contentObj['blocks'].forEach((block, index) => {
      textByBlocks[block.key] = block.text;
      inlineStyleRangesByBlocks[block.key] = block.inlineStyleRanges;
      entityRangesByBlocks[block.key] = block.entityRanges;
      dataByBlocks[block.key] = block.data;

      let blockNew = Object.assign({}, block); //make a shalloe copy of current block.
      delete blockNew.text; //delete the text only in the copy one.
      delete blockNew.inlineStyleRanges;
      delete blockNew.entityRanges;
      delete blockNew.data;
      blockLigntening.push(blockNew);
    });
    if(
      JSON.stringify(textByBlocks).length > 4000 ||
      JSON.stringify(blockLigntening).length > 1000 ||
      JSON.stringify(inlineStyleRangesByBlocks).length > 1000 ||
      JSON.stringify(entityRangesByBlocks).length > 1000 ||
      JSON.stringify(dataByBlocks).length > 1000 ||
      contentObj['blocks'].length > 580 ||
      JSON.stringify(contentObj['entityMap']) > 1000
    ) return false;
    
    // and everything is fine for this mark
    return true;

  })
  if (!marksObjConfirm || !marksDataConfirm) {
    throw new validationError("the marks list do not match the data obj, or the marks has incorrect format.", 7)
  };


  // checking if the assigned nodes was allowed
  let ancestorsByType;
  try{
    ancestorsByType = await _get_ancestors(userId);
  }
  catch(error){
    throw error;
    return ; //close the process
  }

  // checking is characters in mark not too long (if there is a mark)


}

module.exports = validateShared;
