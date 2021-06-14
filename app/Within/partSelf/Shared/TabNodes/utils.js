export function _locationsNodes_levelHandler(locationsNodesList, nounsBasic){
  let mapListByLength = { // list seperate by parentTree in nounsBasic
    length_0: [],
    length_1: [],
    length_2: []
  };
  let mapObjByNodeAndChildren = {}; // list of nodes have children
  locationsNodesList.forEach((nodeId, index) => {
    if(!(nodeId in nounsBasic)) return;
    let parentTree = nounsBasic[nodeId].parentTree;
    switch (parentTree.length) {
      case 0:
        mapListByLength["length_0"].push(nodeId)
        break;
      case 1:
        mapListByLength["length_1"].push(nodeId)
        break;
      case 2:
        mapListByLength["length_2"].push(nodeId)
        break;
      default:
        null
    };
  });
  mapListByLength["length_1"].forEach((nodeId, index) => {
    if(!(nodeId in nounsBasic)) return;
    let parentTree = nounsBasic[nodeId].parentTree;
    if(mapListByLength['length_0'].indexOf(parentTree[0]) >= 0 ){
      if(parentTree[0] in mapObjByNodeAndChildren) mapObjByNodeAndChildren[parentTree[0]].push(nodeId)
      else{
        mapObjByNodeAndChildren[parentTree[0]] = [nodeId];
      };
    };
  });
  mapListByLength["length_2"].forEach((nodeId, index) => {
    if(!(nodeId in nounsBasic)) return;
    let parentTree = nounsBasic[nodeId].parentTree;
    if(mapListByLength['length_1'].indexOf(parentTree[0]) >= 0){
      if(parentTree[0] in mapObjByNodeAndChildren) mapObjByNodeAndChildren[parentTree[0]].push(nodeId)
      else{
        mapObjByNodeAndChildren[parentTree[0]] = [nodeId];
      };
    }
    else if(mapListByLength['length_0'].indexOf(parentTree[1]) >= 0 ){
      if(parentTree[1] in mapObjByNodeAndChildren) mapObjByNodeAndChildren[parentTree[1]].push(nodeId)
      else{
        mapObjByNodeAndChildren[parentTree[1]] = [nodeId];
      };
    };
  });
  // start
  let nodesSetList = []; // list going to return to comp.
  let lengthKeys = ['length_0', "length_1", "length_2"];
  let levelKeys = ['level_0', "level_1", "level_2"];
  /*
  we are goin to make a return array in the form like this:
  [
    {
      levelNow: [],  // level_0
      levelNext: [
        {
          levelNow: [], // level_1
          levelNext: [
            {
              levelNow: [] // level_2
            }
          ]
        },
        {}
      ]
    }
  ]
  */
  // claim a recursive f() to handle node to mapObjByNodeAndChildren
  const loopByNodeInMap = (nodeId, level, originalLevel) => {
    let levelsSet = {};
    levelsSet['levelNow'] = [nodeId];
    if(nodeId in mapObjByNodeAndChildren){
      levelsSet['levelNext'] = [];
      mapObjByNodeAndChildren[nodeId].forEach((nodeIdLNext, indexLNext) => {
        levelsSet['levelNext'].push(loopByNodeInMap(nodeIdLNext, level+1)); // because we only got '3' levels, so we can set 'level' attribute simply like this
      });
    };
    // going to 'delete' the used nodeId
    if(!!originalLevel && (level+1 == originalLevel)) return levelsSet; // But! if we loop finally back to the first start, don't delete ant item to prevent 'jump' error
    // delete self from the correspond list
    let deletedIndex = 0;
    deletedIndex = mapListByLength[lengthKeys[level]].indexOf(nodeId);
    if(deletedIndex >= 0 ) mapListByLength[lengthKeys[level]].splice(deletedIndex, 1)
    else if(deletedIndex < 0 && (level+1 < 3)){
      deletedIndex = mapListByLength[lengthKeys[level+1]].indexOf(nodeId);
      mapListByLength[lengthKeys[level+1]].splice(deletedIndex, 1);
    };
    return levelsSet;
  };
  for(let i =0; i < 3; i++){
    mapListByLength[lengthKeys[i]].forEach((nodeId, index) => {
      nodesSetList.push(loopByNodeInMap(nodeId, i, i+1)); // "i+1" here just a quick method to avoid '0' causing 'false' result in operator inside the loopByNodeInMap
    });
  };

  return nodesSetList;
}
