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
  // start
  let nodesSetList = []; // list going to return to comp.
  let lengthKeys = ['length_0', "length_1", "length_2"];
  let levelKeys = ['level_0', "level_1", "level_2"];
  // claim a recursive f() to handle node to mapObjByNodeAndChildren
  const loopInMapObj = (levelsSet, nodeId, levelNext) => {
    if(nodeId in mapObjByNodeAndChildren){
      mapObjByNodeAndChildren[nodeId].forEach((nodeIdLNext, indexLNext) => {
        levelsSet[levelKeys[levelNext]].push(nodeIdLNext);
        if(levelNext == 1) loopInMapObj(levelsSet, nodeIdLNext, 2);
        let deletedIndex = mapListByLength[lengthKeys[levelNext]].indexOf(nodeIdLNext);
        mapListByLength[lengthKeys[levelNext]].splice(deletedIndex, 1);
      });
    }
  };
  for(let i =0; i < 3; i++){
    mapListByLength[lengthKeys[i]].forEach((nodeId, index) => {
      let levelsSet = {
        level_0: [],
        level_1: [],
        level_2: []
      }
      levelsSet[levelKeys[i]].push(nodeId);
      if(i < 2){ loopInMapObj(levelsSet, nodeId, i+1); }; // no more recursive to level 2
      nodesSetList.push(levelsSet); // push the set into list we want
    });
  };

  return nodesSetList;
}
