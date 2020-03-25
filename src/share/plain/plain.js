const express = require('express');
const execute = express.Router();
const fs = require('fs');
const path = require("path");
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
const _DB_units_nodesAssign = require('../../../db/models/index').units_nodes_assign;

const {
  _handle_ErrCatched,
  forbbidenError,
} = require('../../utils/reserrHandler.js');
const {
  _res_success_201
} = require('../../utils/resHandler.js');


function shareHandler_POST(req, res){

  const userId = req.extra.tokenUserId; //use userId passed from pass.js

  new Promise((resolve, reject)=>{
    //add it into shares as a obj value
    let modifiedBody = {};

    let coverBase64Buffer ,beneathBase64Buffer;
    //deal with cover img first.
    let coverBase64Splice = req.body.coverBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
    coverBase64Buffer = Buffer.from(coverBase64Splice[2], 'base64');
    //then deal with beneath img if any.
    if(req.body.beneathBase64){
      let beneathBase64Splice = req.body.beneathBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
      beneathBase64Buffer = Buffer.from(beneathBase64Splice[2], 'base64');
    }
    fs.writeFile(path.join(projectRootPath, userImg+userId+'/'+req.body.submitTime+"_layer_0.jpg"), coverBase64Buffer, function(err){
      if(err) {
        reject(new internalError(err ,131));
        return;
      };
      modifiedBody['url_pic_layer0'] = userId+'/'+req.body.submitTime+'_layer_0.jpg';
      if(req.body.beneathBase64){
        fs.writeFile(path.join(projectRootPath, userImg+userId+'/'+req.body.submitTime+"_layer_1.jpg"), beneathBase64Buffer, function(err){
          if(err) {
            reject(new internalError(err ,131));
            return;
          };
          modifiedBody['url_pic_layer1'] = userId+'/'+req.body.submitTime+'_layer_1.jpg';
          resolve(modifiedBody);
        });
      }else{
        resolve(modifiedBody);
      }
    })
  }).then((modifiedBody)=>{
    Object.assign(modifiedBody, req.body);
    delete modifiedBody.coverBase64;
    delete modifiedBody.beneathBase64;

    return(modifiedBody);
  }).then((modifiedBody)=>{
    //first, write into the table units
    //and get the id_unit here first time
    let unitProfile = {
      'id_author': userId,
      'url_pic_layer0': modifiedBody.url_pic_layer0,
      'url_pic_layer1': modifiedBody.url_pic_layer1,
      'id_primer': null
    };
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
            return modifiedBody;
          })
          .catch((err)=>{
            throw err
          });
        }
        else return modifiedBody;
      });
    })
    .catch((err)=>{
      throw err
    });

  }).then((modifiedBody)=>{
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
      return _DB_marks.bulkCreate(marksArr).then((createdInst)=>{
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
      //check if the noun exist! in case some people use faked nound id,
      //and prepared to insert into attribution
      let concatList = modifiedBody.nodesSet.assign.concat(modifiedBody.nodesSet.tags); //combined list pass from req
      return _DB_nouns.findAll({
        where: {id: concatList}
      }).then(results => {
        //if there is no validate noun passed from client,
        //cancel by reject to the Top level
        //& warn the client
        if(results.length!= concatList.length){
          throw(new forbbidenError({"warning": "you've passed an invalid nouns key"}, 120));return;};

        //make nodes array by rows
        let nodesArr = results.map((row, index)=>{
              return ({
                id_noun: row.id,
                id_unit: modifiedBody.id_unit,
                id_author: userId
              })
            }),
            assigendNodesArr = modifiedBody.nodesSet.assign.map((nodeId, index)=>{
              return ({
                id_unit: modifiedBody.id_unit,
                id_author: userId,
                nodeAssigned: nodeId
              })
            });
        //then create into table attribution
        let creationAttri =()=>{return _DB_attribution.bulkCreate(nodesArr, {fields: ['id_unit', 'id_author', 'id_noun']}).catch((err)=> {throw err})};
        let creationNodesAssign = ()=>{return _DB_units_nodesAssign.bulkCreate(assigendNodesArr).catch((err)=>{throw err});};

        return Promise.all([
          new Promise((resolve, reject)=>{creationAttri().then(()=>{resolve();});}),
          new Promise((resolve, reject)=>{creationNodesAssign().then(()=>{resolve();});})
        ])
        .then(()=>{
          return;
        })
        .catch((err)=>{
          throw err
        });
      })
      .catch((err)=>{
        throw err
      });

    }

    return Promise.all([
      new Promise((resolve, reject)=>{creationMarks().then((marksIdList)=>{resolve(marksIdList);});}),
      new Promise((resolve, reject)=>{handlerNodesSet().then(()=>{resolve();});})
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

      return modifiedBody;
    })
    .catch((err)=>{
      throw "error thrown from marks created & nodesSet handling process"+ err
    });

  }).then((modifiedBody)=>{
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
      return modifiedBody;
    })
    .catch((err)=>{
      throw "error thrown from marks_content created process"+ err
    });

  })
  .then((modifiedBody)=>{
    //every essential step for a shared has been done
    //return success & id just created
    _res_success_201(res, {unitId: modifiedBody.id_unit_exposed}, '');
    //resolve, and return the modifiedBody for backend process
    return(modifiedBody);
  })
  .catch((error)=>{
    //a catch here, shut the process if the error happened in the 'front' steps
    _handle_ErrCatched(error, req, res);
    return Promise.reject();
    //we still need to 'return', but return a reject(),
    //otherwise it would still be seen as 'handled', and go to the next .then()
  })
  .then((modifiedBody)=>{
    //backend process
    //no connection should be used during this process
    let concatList = modifiedBody.nodesSet.assign.concat(modifiedBody.nodesSet.tags); //combined list pass from req

    return _DB_nodes_activity.findAll({
      where: {id_node: concatList}
    })
    .then((nodesActivity)=>{
      //if the node was new used, it won't has record from nodesActivity
      //so let's compare the selection and the list in modifiedBody
      //first, copy a new array, prevent modification to modifiedBody
      let nodesList = concatList.slice();
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
  if(process.env.NODE_ENV == 'development') winston.verbose('POST: /share');
  shareHandler_POST(req, res);
})

module.exports = execute
