export function _locationsNodes_mapHandler(locationsNodes, nounsBasic){
  let nodesMapList = {
    length_0: [],
    length_1: {},
    length_2: {}
  };
  let appendNodesList = [];
  locationsNodes.forEach((nodesGroup, index) => {
    appendNodesList = appendNodesList.concat(nodesGroup); // just make a 'one level' array
  });
  appendNodesList.forEach((nodeEachId, index) => {
    if( !(nodeEachId in nounsBasic) ) return ; // go next round if no data
    let parentTree = nounsBasic[nodeEachId].parentTree;
    switch (parentTree.length) {
      case 0:
      nodesMapList["length_0"].push(nodeEachId);
      break;
      case 2:
      for(let i=0; i < parentTree.length ; i++){ // parentTree.length must be '2'
        if(parentTree[i] in nodesMapList["length_2"]) nodesMapList['length_2'][parentTree[i]].push(nodeEachId)
        else{
          nodesMapList["length_2"][parentTree[i]] = [nodeEachId];
        };
      };
      break;
      case 1:
      if(parentTree[0] in nodesMapList["length_1"]) nodesMapList['length_1'][parentTree[0]].push(nodeEachId)
      else{
        nodesMapList["length_1"][parentTree[0]] = [nodeEachId];
      };
      break;
      default:
      null
    };
  });

  return nodesMapList;
}
