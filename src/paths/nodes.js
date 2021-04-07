const express = require('express');
const execute = express.Router();
const winston = require('../../config/winston.js');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const _DB_paths = require('../../db/models/index').paths;
const _DB_units = require('../../db/models/index').units;
const _DB_unitsNodesAssign = require('../../db/models/index').units_nodes_assign;
const _DB_pathsSubcate = require('../../db/models/index').paths_subcate;
const _DB_unitsPathsSubdis = require('../../db/models/index').units_paths_subdistribute;
const {_res_success} = require('../utils/resHandler.js');
const {
  _handle_ErrCatched,
  notFoundError
} = require('../utils/reserrHandler.js');

async function _handle_GET_paths_NodesAssigned(req, res){
  const reqPathProject = req.query.pathProject;

  try{
    const targetProject = await _DB_paths.findOne({
      where: {pathName: reqPathProject}
    });
    // if 'null' result -> not a valid pathName
    if(!targetProject){ //'null'
      throw new notFoundError("Project you request was not found. Only a valid path name was allowed.", 52);
      return; //stop and end the handler.
    };
    // now, there is an issue that the identity of the id_author in units_nodes_assign can't be identified
    // we could only start from units to identfy the author identity
    const projectUnits = await _DB_units.findAll({
      where: {
        used_authorId: targetProject.id,
        author_identity: 'pathProject'
      }
    });
    let unitsList = projectUnits.map((item, index)=>{
      return item.id;
    });

    if(!!req.query.filterSubCate){ // if we are limit by sub category
      const subCatesInfo = await _DB_pathsSubcate.findOne({
        where: {
          id_path: targetProject.id,
          exposedId: req.query.filterSubCate
        }
      });
      const subCateUnits = await _DB_unitsPathsSubdis.findAll({
        where: {
          id_unit: unitsList,
          id_path: targetProject.id,
          id_subPath: subCatesInfo.id,
        }
      });
      unitsList = subCateUnits.map((row, index)=>{ return row.id_unit;});
    };

    let nodesList = [];
    if(!!req.query.suggestion){ // if we are return list for suggestions used in NavFIlter, only return
      let assignedNodes = await _DB_unitsNodesAssign.findAll({
        where: {
          id_unit: unitsList,
        },
        attributes: ["nodeAssigned", "createdAt"],
        order: [ //make sure the order of arr are from latest
          Sequelize.literal('`createdAt` DESC') //and here, using 'literal' is due to some wierd behavior of sequelize,
          //it would make an Error if we provide col name by 'arr'
        ]
      });
      for(let i=0 ; i< assignedNodes.length ; i++){
        if(nodesList.length > 5) break;
        if(nodesList.indexOf(assignedNodes[i].nodeAssigned) < 0){
          nodesList.push(assignedNodes[i].nodeAssigned);
        };
      };
    }
    else{
      let assignedNodes = await _DB_unitsNodesAssign.findAll({
        where: {
          id_unit: unitsList,
        },
        attributes: ["nodeAssigned"],
        group: 'nodeAssigned', // means we combined the rows by nodeAssigned
      });
      nodesList = assignedNodes.map((nodeRow, index)=>{
        return nodeRow.nodeAssigned;
      });
    };

    let sendingData={
      nodesList: nodesList,
      temp: {}
    };

    _res_success(res, sendingData, "GET: /paths/nodes, /assigned , complete.");
  }
  catch(error){
    _handle_ErrCatched(error, req, res);
    return;
  }

}

execute.get('/assigned', function(req, res){
  if(process.env.NODE_ENV == 'development') winston.verbose('GET: /paths/nodes, /assigned ');
  _handle_GET_paths_NodesAssigned(req, res);
})

module.exports = execute;
