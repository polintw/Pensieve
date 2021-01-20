const express = require('express');
const execute = express.Router();
const fs = require('fs');
const path = require("path");
const sharp = require('sharp');
const {validateShared} = require('./validation.js');
const projectRootPath = require("../../../projectRootPath");
const winston = require('../../../config/winston.js');
const {
  userImg
} = require('../../../config/path.js');
const _DB_units = require('../../../db/models/index').units;
const _DB_marks = require('../../../db/models/index').marks;
const _DB_nouns = require('../../../db/models/index').nouns;
const _DB_responds = require('../../../db/models/index').responds;
const _DB_marksContent = require('../../../db/models/index').marks_content;
const _DB_attribution = require('../../../db/models/index').attribution;
const _DB_nodes_activity = require('../../../db/models/index').nodes_activity;
const _DB_usersPaths = require('../../../db/models/index').users_paths;
const _DB_units_nodesAssign = require('../../../db/models/index').units_nodes_assign;
const _DB_unitsStatInteract = require('../../../db/models/index').units_stat_interact;
const {
  _handle_ErrCatched,
  internalError
} = require('../../utils/reserrHandler.js');
const {
  _res_success_201
} = require('../../utils/resHandler.js');

const resizeThumb = (base64Buffer)=>{
  return sharp(base64Buffer)
      .rotate()
      .resize({width: 640, height: 640, fit: 'inside'})  // px, define it to nHD 640 x 360
      .jpeg({
          quality: 64
        })
      .toBuffer({ resolveWithObject: true })
      .then(({data, info})=>{
        winston.verbose(`${"resizeThumb, inside POST /share, "} ${"outputFormat: "+info.format}, ${"outputSize: "+info.size}`);
        let imgBase64 = new Buffer.from(data, 'binary').toString('base64');
        return imgBase64;
      }).catch((err)=>{
        throw err;
      });
};

async function shareHandler_POST(req, res){
  const userId = req.extra.tokenUserId; //use userId passed from pass.js
  let modifiedBody = {};
  Object.assign(modifiedBody, req.body);

  //First of all, validating the data passed
  try{
    await validateShared(modifiedBody, userId)
  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return ; //close the process
  }
  // before a proemise, we detect the identity author used by a async f()
  let authorIdentity = modifiedBody.authorIdentity,
      authorIdentityObj = {};
  try{
    if(authorIdentity != 'userAccount'){ // now should be the 'pathName' of pathProject
      let usersPath = await _DB_usersPaths.findOne({
        where: {
          id_user: userId,
          pathName: authorIdentity
        }
      });
      if(!usersPath){ // 'null', then change identity to user self from now on
        authorIdentity == 'userAccount';
        authorIdentityObj['identity'] = 'user';
      }
      else{
        // valid modifiedBody.authorIdentity, so keep 'authorIdentity' passed from client
        authorIdentityObj['identity'] = 'pathProject';
        authorIdentityObj['usedId'] = usersPath.id_path;
      };
    }
  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return ; //close the process
  }


  new Promise((resolve, reject)=>{
    //add it into shares as a obj value

    let coverBase64Buffer ,beneathBase64Buffer;
    //deal with cover img first.
    let coverBase64Splice = req.body.coverBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
    coverBase64Buffer = Buffer.from(coverBase64Splice[2], 'base64');
    //then deal with beneath img if any.
    if(req.body.beneathBase64){
      let beneathBase64Splice = req.body.beneathBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
      beneathBase64Buffer = Buffer.from(beneathBase64Splice[2], 'base64');
    };

    // the img pass from client could as big as 1920px x 1920px
    // prepare a smaller one for 'thumb'
    resizeThumb(coverBase64Buffer)
    .then((coverBase64Thumb)=>{
      // save image pass from client
      fs.writeFile(path.join(projectRootPath, userImg+userId+'/'+req.body.submitTime+"_layer_0.jpg"), coverBase64Buffer, function(err){
        if(err) {
          reject(new internalError(err ,131));
          return;
        };
        modifiedBody['url_pic_layer0'] = userId+'/'+req.body.submitTime+'_layer_0.jpg'; // save path to DB units
        // save thumb img to path _thumb
        let coverBase64BufferThumb = Buffer.from(coverBase64Thumb, 'base64');
        fs.writeFile(path.join(projectRootPath, userImg+userId+'/'+'thumb_'+req.body.submitTime+"_layer_0.jpg"), coverBase64BufferThumb, function(err){
          if(err) {
            reject(new internalError(err ,131));
            return;
          };
          if(req.body.beneathBase64){
            fs.writeFile(path.join(projectRootPath, userImg+userId+'/'+req.body.submitTime+"_layer_1.jpg"), beneathBase64Buffer, function(err){
              if(err) {
                reject(new internalError(err ,131));
                return;
              };
              modifiedBody['url_pic_layer1'] = userId+'/'+req.body.submitTime+'_layer_1.jpg';
              resolve();
            });
          }else{
            resolve();
          }
        })
      });
    })
    .catch((err)=>{
      reject(new internalError(err ,131));
    });
  }).then(()=>{

    delete modifiedBody.coverBase64;
    delete modifiedBody.beneathBase64;

    return;
  }).then(()=>{
    //first, write into the table units
    //and get the id_unit here first time
    let unitProfile = {
      'id_author': userId,
      'url_pic_layer0': modifiedBody.url_pic_layer0,
      'url_pic_layer1': modifiedBody.url_pic_layer1,
      'id_primer': null,
      'author_identity': authorIdentityObj.identity,
      'used_authorId': ("usedId" in authorIdentityObj) ? authorIdentityObj.usedId : null,
      'outboundLink_main': (!!modifiedBody.outboundLinkMain && typeof(modifiedBody.outboundLinkMain)=="string" ) ? modifiedBody.outboundLinkMain : null,
    };
    if(!!modifiedBody.exifGps.latitude_img) unitProfile['latitude_img'] = parseFloat(modifiedBody.exifGps.latitude_img); // to keep it untouched if latitude there was not latitude data
    if(!!modifiedBody.exifGps.longitude_img) unitProfile['longitude_img'] = parseFloat(modifiedBody.exifGps.longitude_img);
    /*
    three things related to new unit id, but not too complicated completed in this block
    1. create new record & get unit id
    2. create responds if any primer
    3. create stat_interact by new id
    */
    return new Promise ((resolveLoc, rejectLoc)=>{
      if(!!modifiedBody.primer){
        return _DB_units.findOne({
          where: {exposedId: modifiedBody.primer}
        })
        .then((resultPrimer)=>{
          resolveLoc(resultPrimer)
        })
        .catch((err)=>{
          rejectLoc(err);
        });
      }
      else resolveLoc(false);
    })
    .then((primer)=>{
      if(!!primer){
        unitProfile['id_primer'] = primer.id;
      }

      return _DB_units.create(unitProfile)
      .then((createdUnit)=>{
        modifiedBody['id_unit'] = createdUnit.id;
        modifiedBody['id_unit_exposed'] = createdUnit.exposedId;

        if(!!primer){
          return _DB_responds.create({
            id_unit: createdUnit.id,
            id_primer: primer.id,
            id_author: userId,
            primer_author: primer.id_author,
            primer_createdAt: primer.createdAt,
          })
          .then((createdRespond)=>{
            return createdUnit;
          })
          .catch((err)=>{
            throw err
          });
        }
        else return createdUnit;
      })
      .then((createdUnit)=> {
        return _DB_unitsStatInteract.create({
          id_unit: createdUnit.id
        })
        .then((createdStatInteract)=>{
          return;
        })
        .catch((err)=>{
          throw err
        });
      });
    })
    .catch((err)=>{
      throw err
    });

  }).then(()=>{
    //this block, write into the table: marks(and get id_mark back), attribution, and units_nodes_assign.
    //And Notice! we need id_mark for marks_content, so update to it happened in next step.
    let marksArr = modifiedBody.joinedMarksList.map((markKey, index)=>{
      let markObj = modifiedBody.joinedMarks[markKey];

      return {
        id_unit: modifiedBody.id_unit,
        id_author: userId,
        layer: markObj.layer,
        portion_top: markObj.top,
        portion_left: markObj.left,
        serial: markObj.serial
      };
    });

    const creationMarks = ()=>{
      return _DB_marks.bulkCreate(marksArr)
      .then((createdInst)=>{
        let idList = createdInst.map((newRow, index)=>{
          return newRow.id
        })

        return idList;
      })
      .catch((err)=>{
        throw err
      });
    };
    const handlerNodesSet = ()=>{
      /*
      the nodes passed to here were already validated, could used directly
      */
      let assignedNodes= modifiedBody.nodesSet.map((assignedObj, index)=>{
        return assignedObj.nodeId;
      });
      //prepared to insert into attribution
      return _DB_nouns.findAll({
        where: {id: assignedNodes}
      })
      .then(resultNodes => {
        /*till this moment the check for assigned, attributed nodes have completed.
        for assigned, we assumed the list here can be trusted undoubt.
        */
        let assignedNodesArr = modifiedBody.nodesSet.map((assignedObj, index)=>{
          return ({
            id_unit: modifiedBody.id_unit,
            id_author: userId,
            nodeAssigned: assignedObj.nodeId,
            belongTypes: assignedObj.type
          })
        });
        //make array for attribution
        let nodesArr = resultNodes.map((row, index)=>{
              return ({
                id_noun: row.id,
                id_unit: modifiedBody.id_unit,
                id_author: userId,
                author_identity: authorIdentityObj.identity,
                used_authorId: ("usedId" in authorIdentityObj) ? authorIdentityObj.usedId : null
              })
            });
        //then create into table attribution
        let creationAttri =()=>{return _DB_attribution.bulkCreate(nodesArr).catch((err)=> {throw err})};
        let creationNodesAssign = ()=>{return _DB_units_nodesAssign.bulkCreate(assignedNodesArr).catch((err)=>{throw err});};

        return Promise.all([
          new Promise((resolve, reject)=>{creationAttri().then(()=>{resolve();});}),
          new Promise((resolve, reject)=>{creationNodesAssign().then(()=>{resolve();});})
        ]);
      })
      .catch((err)=>{
        throw err
      });

    }

    return Promise.all([
      new Promise((resolve, reject)=>{creationMarks().then((marksIdList)=>{resolve(marksIdList);});}),
      new Promise((resolve, reject)=>{handlerNodesSet().then(()=>{resolve();}).catch((err)=>{reject(err);});}).catch((err)=> {throw err})
    ])
    .then((results)=>{
      let marksIdList = results[0];
      //replace the 'key' used for marks in modifiedBody
      let newIdMarksList=[], newIdMarksObj={};
      newIdMarksList = modifiedBody.joinedMarksList.map((originKey, index)=>{
        newIdMarksObj[marksIdList[index]] = modifiedBody.joinedMarks[originKey];
        return marksIdList[index];
      });

      modifiedBody['newIdMarksList'] = newIdMarksList;
      modifiedBody['newIdMarksObj'] = newIdMarksObj;

      return;
    })
    .catch((err)=>{
      throw err;
    });

  }).then(()=>{
    //now in this section, update into the marks_content
    //it's the final records need to be saved before res to the client
    let insertArr = modifiedBody.newIdMarksList.map((markId, index) => {
      const contentObj = modifiedBody.newIdMarksObj[markId].editorContent;
      let blockLigntening=[],
          textByBlocks={},
          inlineStyleRangesByBlocks={},
          entityRangesByBlocks={},
          dataByBlocks={};

      contentObj.blocks.forEach((block, index) => {
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

      return {
        id_mark : markId,
        id_unit : modifiedBody.id_unit,
        contentEntityMap: JSON.stringify(Object.assign({}, contentObj.entityMap)),
        contentBlocks_Light: JSON.stringify(blockLigntening),
        text_byBlocks: JSON.stringify(textByBlocks),
        inlineStyleRanges_byBlocks: JSON.stringify(inlineStyleRangesByBlocks),
        entityRanges_byBlocks: JSON.stringify(entityRangesByBlocks),
        data_byBlocks: JSON.stringify(dataByBlocks),
      };
    });

    return _DB_marksContent.bulkCreate(insertArr).then((createdInst)=>{
      return;
    })
    .catch((err)=>{
      throw err;
    });

  })
  .then(()=>{
    //every essential step for a shared has been done
    //return success & id just created
    _res_success_201(res, {
      unitId: modifiedBody.id_unit_exposed,
      authorIdentity: authorIdentity
    }, '');
    //resolve, and return the modifiedBody for backend process
    return;
  })
  .catch((error)=>{
    //a catch here, shut the process if the error happened in the 'front' steps
    _handle_ErrCatched(error, req, res);
    return Promise.reject();
    //we still need to 'return', but return a reject(),
    //otherwise it would still be seen as 'handled', and go to the next .then()
  })
  .then(()=>{
    //backend process
    //no connection should be used during this process
    let assignedNodes = modifiedBody.nodesSet.map((assignedObj,index)=>{
      return assignedObj.nodeId;
    });

    return _DB_nodes_activity.findAll({
      where: {id_node: assignedNodes}
    })
    .then((nodesActivity)=>{
      //if the node was new used, it won't has record from nodesActivity
      //so let's compare the selection and the list in modifiedBody
      //first, copy a new array, prevent modification to modifiedBody
      let nodesList = assignedNodes.slice();
      //second, make a list reveal record in nodesActivity
      let activityList = nodesActivity.map((row,index)=>{ return row.id_node;});
      let newList = [];
      //then, check id in list, skip the node already exist in nodesActivity
      nodesList.forEach((nodeId, index)=>{
        if(activityList.indexOf(nodeId) > (-1)) return;
        newList.push({
          id_node: nodeId,
          status: 'online',
          id_firstUnit: modifiedBody.id_unit
        });
      });
      //final, insert to table if there is any new used node.
      if(newList.length > 0){
        return _DB_nodes_activity.bulkCreate(newList);
      }
    })
    .catch((error)=>{
      /*
      Main error handler for whole backend process!
      the backend process has its own error catch, different from the previous process.
      and throw to upper catch just to make a clear structure.
      */
      winston.error(`${"Internal process "} , ${"for "+"shareHandler_POST: "}, ${error}`);
    });
  })
  .catch((error)=>{
    //nothing need to happend here, just a catch to deal with chain design(.then() after .catch())
  });

}

execute.post('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('POST: /share/create');
  shareHandler_POST(req, res);
})

module.exports = execute
