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
        let currentKey = parentTree[i];
        if(currentKey in nodesMapList["length_2"]){
          if(i == 0) nodesMapList['length_2'][currentKey].push(nodeEachId)
          else{
            if(parentTree[i-1] in nodesMapList['length_2'][currentKey]){
              nodesMapList['length_2'][currentKey][parentTree[i-1]].push(nodeEachId);
            } else nodesMapList['length_2'][currentKey][parentTree[i-1]] = [nodeEachId];
          };
        }
        else{
          if(i == 0) nodesMapList["length_2"][currentKey] = [nodeEachId]
          else{
            nodesMapList['length_2'][currentKey] = {};
            nodesMapList['length_2'][currentKey][parentTree[i-1]] = [nodeEachId];
          }
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
