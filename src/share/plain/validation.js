const Jimp = require('jimp');
const {
  forbbidenError,
  internalError
} = require('../../utils/reserrHandler.js');

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

  // checking if the assigned nodes was allowed
  let ancestorsByType;
  try{
    ancestorsByType = await _get_ancestors(userId);
  }
  catch(error){
    throw error;
    return ; //close the process
  }

  // checking is the img valid
  let coverBase64Buffer ,beneathBase64Buffer;
  //deal with cover img first.
  let coverBase64Splice = modifiedBody.coverBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
      beneathBase64Splice = modifiedBody.beneathBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

  coverBase64Buffer = Buffer.from(coverBase64Splice[2], 'base64');
  beneathBase64Buffer = Buffer.from(beneathBase64Splice[2], 'base64');

  Jimp.read(coverBase64Buffer)
  .then( img => {
    if (img.bitmap.width <= 0 || img.bitmap.height <= 0) { //do not make a img
      throw new forbbidenError("You didn't submit with an valid img.", 123));
    }
  }).catch ( err => {
    throw err;
  });

  // checking is the author really exist

  // checking is characters in mark not too long (if there is a mark)

  // checking the markObj passed in joinedMarks {reasonable portion_top, portion_left, layer & serial}

}

module.exports = validateShared;
