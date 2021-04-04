const Jimp = require('jimp');
const isEmpty = require('../../utils/isEmpty');
const {selectNodesParent } = require('../../nouns/utils.js');
const {
  forbbidenError,
  internalError,
  notFoundError,
  validationError
} = require('../../utils/reserrHandler.js');
const _DB_users = require('../../../db/models/index').users;
const _DB_units = require('../../../db/models/index').units;
const _DB_nouns = require('../../../db/models/index').nouns;
const _DB_marks = require('../../../db/models/index').marks;
const _DB_usersNodesHomeland = require('../../../db/models/index').users_nodes_homeland;
const _DB_usersNodesResidence = require('../../../db/models/index').users_nodes_residence;

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
  let belongList = [], setTypes = [], typeToNodes={}; //list used to select from assign, would incl. parent of belong nodes.
  if(!!userResidence){ belongList.push(userResidence.id_node); setTypes.push("residence"); typeToNodes["residence"]= userResidence.id_node};
  if(!!userHomeland){ belongList.push(userHomeland.id_node); setTypes.push("homeland");  typeToNodes["homeland"]= userHomeland.id_node};
  // build a check point to block action without belong setting first .
  if(belongList.length < 1) throw new forbbidenError("Please, submit your Shared only after set a corner you belong to.", 120);
  const ancestorsInfo = await selectNodesParent(belongList);

  setTypes.forEach((type, index)=>{ //loop by list client set
    let nodeId = typeToNodes[type];
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
  const coverImg = await Jimp.read(coverBase64Buffer);
  if (coverImg.bitmap.width <= 0 || coverImg.bitmap.height <= 0) { //do not make a img
    throw new forbbidenError("You didn't submit with an valid img.", 123);
    return;
  }

  if (!!modifiedBody.beneathBase64){
    beneathBase64Buffer = Buffer.from(beneathBase64Splice[2], 'base64');
    const beneathImg = await Jimp.read(beneathBase64Buffer);
    if (beneathImg.bitmap.width <= 0 || beneathImg.bitmap.height <= 0) { //do not make a img
      throw new forbbidenError("You didn't submit with an valid img.", 123);
      return;
    }
  };

  // checking if there is a primer
  if(!!modifiedBody.primer){
    const resultPrimer = await _DB_units.findOne({
      where: {exposedId: modifiedBody.primer}
    });

    if(!resultPrimer) throw new notFoundError("Please responds to a valid Shared.", 34);
  }

  // checking the markObj passed in joinedMarks {reasonable portion_top, portion_left, layer & serial}
  const marksKeys = Object.keys(modifiedBody.joinedMarks);
  // compare list to data obj
  const marksObjConfirm = modifiedBody.joinedMarksList.every((markKey, index) => { return markKey in modifiedBody.joinedMarks});
  // deeper to data format
  const marksDataConfirm = marksKeys.every((key, index)=>{
    //first, we do not allow more than 12 mark in a Unit
    if(index > 11) return false;

    const obj = !isEmpty(modifiedBody.joinedMarks[key]) ? modifiedBody.joinedMarks[key] : {};
    if(!('editorContent' in obj) || !('layer' in obj) || !('left' in obj) || !('top' in obj) || !("serial" in obj)) return false; //block here
    // check, length of every property except 'blocks' in 'editorContent' not longer than limit
    if(
      obj['layer'] != 0 || // now only 1 im was allowed
      !(obj['left'] <= 100 && obj['left'] >= 0) ||
      !(obj['top'] <= 100 && obj['top'] >= 0) ||
      !(obj['serial'] < 13 ) // now only 12 mark is allowed
    ) return false;

    //then, check if editorContent has required format
    const contentObj = !isEmpty(obj['editorContent']) ? obj['editorContent'] : {};
    if (!('entityMap' in contentObj) ||  !("blocks" in contentObj)) return false; //block here

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
      JSON.stringify(contentObj['entityMap']) > 1000
    ) return false;

    // and everything is fine for this mark
    return true;

  })
  if (!marksObjConfirm || !marksDataConfirm) {
    throw new validationError("the marks list do not match the data obj, or the marks has incorrect format.", 7);
    return;
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

  let allowedTypes = ['homeland','residence', 'freeOne'], assignedNodes=[];
  const assignSetConfirm = modifiedBody.nodesSet.every((assignedObj, index) => { //arr.every could be break
    if(allowedTypes.indexOf(assignedObj.type)< 0 || allowedTypes.length <1) { //means the assigned was 'reapeated', which are not allowed under any circumstance
      return false ;
    };

    let indexInAllowed = allowedTypes.indexOf(assignedObj.type);
    allowedTypes.splice(indexInAllowed, 1); //rm type checked in this round
    assignedNodes.push(assignedObj.nodeId);
    return true; //we are using .every(), must return true to go to next round
  });
  if(!assignSetConfirm) {
    throw new forbbidenError(" assignSetConfirm was false, not allowed node type or not user's belonged node.", 120);
    return;
  };
  // checking if all the nodes exist.
  const allNodesConfirm = await _DB_nouns.findAll({
    where: {id: assignedNodes}
  })
  if(allNodesConfirm.length != assignedNodes.length){
    throw new forbbidenError(" some of assignedNodes did not exist.", 120);
    return;
  };

}

async function validateSharedEdit(modifiedBody, userId, exposedId) {
  // checking first if there is really a Unit or not
  let unitId = false, authorId=false;
  await _DB_units.findOne({where: {exposedId: exposedId}})
    .then((result)=>{
      if(!!result){
        unitId = result.id;
        authorId = result.id_author;
      }
    });

  if(authorId != userId){ //if the user are the author?
    throw new forbbidenError("from _handle_unit_AuthorEditing, trying to edit Shared not belong by client.", 39);
    return; //stop and end the handler.
  }
  if(!unitId){ //if the unit really 'existed'
    throw new validationError("from _handle_unit_AuthorEditing, trying to edit Shared not exist.", 325);
    return; //stop and end the handler.
  }
  /*
  Here, in order to trust the processed data, we turn the MarkList from client all to unified type,
  which is 'num', to assure the data type synchronized to the one in DB (which is 100% was integer by table setting)
  */
  const typeStaticJoinedMarksList = modifiedBody.joinedMarksList.map((id, index)=>{
    let typeNumId = parseInt(id);
    if (isNaN(typeNumId)) { return id; }; // a 'new' add has a markId like "undefined_......". it's a string
    return typeNumId;
  });
  // checking the markObj passed in joinedMarks {reasonable portion_top, portion_left, layer & serial}
  // compare list to data obj, each key has matched data
  //this one is important! because we have to trust the list in the steps afterward
  const marksObjConfirm = typeStaticJoinedMarksList.every((markKey, index) => { return markKey in modifiedBody.joinedMarks});
  //checking if all the previous marks still exist (do not allow 'delete' from edit after first published)
  // temp! select marks only at cover layer, leave the beneath layer free
  const prevMarks = await _DB_marks.findAll({where: {id_unit: unitId, layer: 0}});
  const noDeleteConfirm = prevMarks.every((row, index)=>{ return typeStaticJoinedMarksList.indexOf(row.id) > -1 });
  // deeper to data format
  const marksDataConfirm = typeStaticJoinedMarksList.every((key, index)=>{
    //first, we do not allow more than 12 mark in a Unit
    if(index > 11) return false;

    const obj = !isEmpty(modifiedBody.joinedMarks[key]) ? modifiedBody.joinedMarks[key] : {};
    if(!('editorContent' in obj) || !('layer' in obj) || !('left' in obj) || !('top' in obj) || !("serial" in obj)) return false; //block here
    // check, length of every property except 'blocks' in 'editorContent' not longer than limit
    if(
      obj['layer'] != 0 || // now only 1 im was allowed
      !(obj['left'] <= 100 && obj['left'] >= 0) ||
      !(obj['top'] <= 100 && obj['top'] >= 0) ||
      !(obj['serial'] < 13 ) // now only 12 mark is allowed
    ) return false;

    //then, check if editorContent has required format
    const contentObj = !isEmpty(obj['editorContent']) ? obj['editorContent'] : {};
    if (!('entityMap' in contentObj) ||  !("blocks" in contentObj)) return false; //block here
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
      JSON.stringify(contentObj['entityMap']) > 1000
    ) return false;

    // and everything is fine for this mark
    return true;

  })

  if (!marksObjConfirm || !marksDataConfirm) {
    throw new validationError("Your contents do not have correct format or most often, the characters you passed has over the limit.", 7);
    return;
  }
  else if( !noDeleteConfirm){
    throw new validationError("There are some marks missing. Notice, the marks could not be deleted after first published.", 7);
    return;
  };


  // checking if all the nodes exist.
  let assignedNodes= modifiedBody.nodesSet.map((assignedObj, index)=>{
    return assignedObj.nodeId
  });

  const allNodesConfirm = await _DB_nouns.findAll({
    where: {id: assignedNodes}
  })
  if(allNodesConfirm.length != assignedNodes.length){
    throw new forbbidenError("You didn't submit with an allowed nodes.", 120);
    return;
  };

}

module.exports = {
  validateShared,
  validateSharedEdit
};
