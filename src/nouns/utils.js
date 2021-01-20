const winston = require('../../config/winston.js');
const _DB_nouns = require('../../db/models/index').nouns;

export async function selectNodesParent(initList){
  let nodesInfo = {};
  let targetList=initList.slice(); //shallow copy, prevent modifying initList
  /*
  The concept is, we INNER JOIN table nouns to itself everytime,
  to select the child + parent,
  then by while, we check if parent has parent,
  select until the parent was the top level.
  this way is only decrease 1 cycle compare to select one by one after each relationship was checked.
  */
  while (targetList.length > 0) {
    await _DB_nouns.findAll({
      where: {id: targetList},
      include: { //this is worked by comprehensive setting for 'association' --- foreign key between 2 including table(even a foreign key to self )
        model: _DB_nouns,
        as: 'nouns2',
        required: true
      }
    })
    .then((results)=>{
      targetList= []; // no matter what reaons, clean the list first to see if there are any candidate going to next round
      results.forEach((row, index) => {
        nodesInfo[row.id]={
          id: row.id,
          parent_id: row.parent_id
        };
        nodesInfo[row.nouns2.id]={
          id: row.nouns2.id,
          parent_id: row.nouns2.parent_id //could be null
        };
        //"do we need the next round?"
        if(row.nouns2.child && !!row.nouns2.parent_id) targetList.push( row.nouns2.id); //push back to list if stiil has parent going to get
      });
    });
  }; //end of while

  return (nodesInfo);
};

export async function selectNodesChildren(initList, depth){
  let nodesInfo = {};
  let targetList= initList.slice(); //shallow copy, prevent modifying initList
  /*
  The concept is, we select children one level by one,
  then by while, we select until reach the desired level.
  */
  while (targetList.length > 0) {
    // first, minus 1 from depth.
    depth -= 1;
    // select all first level children
    await _DB_nouns.findAll({
      where: {parent_id: targetList},
    })
    .then((results)=>{
      targetList= []; // no matter what reaons, clean the list first to see if there are any candidate going to next round
      results.forEach((row, index) => {
        nodesInfo[row.id]={
          id: row.id,
          parent_id: row.parent_id
        };
      });
      //"do we need the next round?"
      if(depth > 0) targetList.push( row.id); //push back to list if stiil has children going to get
    });
  }; //end of while

  return (nodesInfo);
};
