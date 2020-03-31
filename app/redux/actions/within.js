import {
  SET_INDEXLISTS,
  SET_BELONGSBYTYPE,
  SUBMIT_FEEDASSIGN,
  SUBMIT_CHAINLIST
} from '../types/typesWithin.js';

export function setBelongsByType(typeObj){
  return {type: SET_BELONGSBYTYPE, typeObj: typeObj}
}

export function setIndexList(listsObj){ //mainly used to reset all when unmount
  return {type: SET_INDEXLISTS, lists: listsObj}
}

export function submitFeedAssigned(listsObj){
  return {type: SUBMIT_FEEDASSIGN, listsObj: listsObj}
}

export function submitChainList(listsObj) {
  return { type: SUBMIT_CHAINLIST, listsObj: listsObj }
}
