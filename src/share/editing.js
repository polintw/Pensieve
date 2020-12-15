const express = require('express');
const execute = express.Router();
const path = require("path");
const {validateSharedEdit} = require('./create/validation.js');
const projectRootPath = require("../../projectRootPath");
const winston = require('../../config/winston.js');
const {
  userImg
} = require('../../config/path.js');
const _DB_units = require('../../db/models/index').units;
const _DB_marks = require('../../db/models/index').marks;
const _DB_nouns = require('../../db/models/index').nouns;
const _DB_marksContent = require('../../db/models/index').marks_content;
const _DB_attribution = require('../../db/models/index').attribution;
const _DB_nodes_activity = require('../../db/models/index').nodes_activity;

const {
  _handle_ErrCatched,
  forbbidenError,
  internalError,
  validationError
} = require('../utils/reserrHandler.js');
const {
  _res_success_201
} = require('../utils/resHandler.js');

async function _handle_unit_AuthorEditing(req, res){

  const userId = req.extra.tokenUserId; //use userId passed from pass.js
  const exposedId = req.reqUnitId; //in editing by author, the unit was created so did the unitId
  let modifiedBody = {};
  Object.assign(modifiedBody, req.body);
  //First of all, validating the data passed
  try{
    await validateSharedEdit(modifiedBody, userId, exposedId)
  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return ; //close the process
  }

  //then, we can start process
  let unitId ;
  await _DB_units.findOne({ where: { exposedId: exposedId } })
    .then((result) => {
      if (!!result) {
        unitId = result.id;
      }
    }); // must have a record in db, already passed the validation

  // update related ti units: update outBoundLink
  if(!!modifiedBody.outboundLinkMain && typeof(modifiedBody.outboundLinkMain)=="string" ){
    await _DB_units.update({
      'outboundLink_main': modifiedBody.outboundLinkMain
    }, {
      where: {
        id: unitId
      }
    });
  };

  new Promise((resolve, reject)=>{
    /*
      different from Create, not allow replacing the pic,
      so we jumo the pic process.
      and obviously, we pass the new insertion to units.
    */
    //this block, write into the table: marks(and get id_mark back), attribution.
    //And Notice! we need id_mark for marks_content, so update to it happened in next step.
    let marksArr = modifiedBody.joinedMarksList.map((markKey, index)=>{
      let markObj = modifiedBody.joinedMarks[markKey];

      return {
        id_unit: unitId,
        id_author: userId,
        layer: markObj.layer,
        portion_top: markObj.top,
        portion_left: markObj.left,
        serial: markObj.serial
      };
    });

    const creationMarks = ()=>{
      return _DB_marks.destroy({where: {id_unit: unitId}})
      .then(()=>{
        return _DB_marks.bulkCreate(marksArr).then((createdInst)=>{
          let idList = createdInst.map((newRow, index)=>{
            return newRow.id
          })

          return idList;
        });
      })
      .catch((err)=>{
        throw err
      });
    };

    Promise.all([
      new Promise((resolve, reject)=>{creationMarks().then((marksIdList)=>{resolve(marksIdList);});}),
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

      resolve();
    })
    .catch((err)=>{
      reject(new internalError("error thrown from marks created & nodesSet handling process"+ err, 131));
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
        id_unit : unitId,
        contentEntityMap: JSON.stringify(Object.assign({}, contentObj.entityMap)),
        contentBlocks_Light: JSON.stringify(blockLigntening),
        text_byBlocks: JSON.stringify(textByBlocks),
        inlineStyleRanges_byBlocks: JSON.stringify(inlineStyleRangesByBlocks),
        entityRanges_byBlocks: JSON.stringify(entityRangesByBlocks),
        data_byBlocks: JSON.stringify(dataByBlocks),
      };
    });

    return _DB_marksContent.destroy({where: {id_unit: unitId}})
    .then(()=>{
      return _DB_marksContent.bulkCreate(insertArr).then((createdInst)=>{
        return;
      })
      .catch((err)=>{
        throw err
      });
    })
    .catch((err)=>{
      throw (new internalError("error thrown from marks_content created process"+ err, 131));
    });

  })
  .then(()=>{
    //every essential step for a shared has been done
    //return success & id just created
    _res_success_201(res, {unitId: exposedId}, '');
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
          id_firstUnit: unitId
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
      winston.error(`${"Internal process "} , ${"for "+"authorEditing: "}, ${error}`);
    });
  })
  .catch((error)=>{
    //nothing need to happend here, just a catch to deal with chain design(.then() after .catch())
  });

}

execute.patch('/', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('PATCH: /unit @ '+req.reqUnitId);
  _handle_unit_AuthorEditing(req, res);
})


module.exports = execute;
