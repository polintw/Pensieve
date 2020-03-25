import {
  SET_INDEXLISTS,
  SET_BELONGSBYTYPE,
  SUBMIT_FEEDASSIGN
} from '../types/typesWithin.js';

export function setBelongsByType(typeObj){
  return {type: SET_BELONGSBYTYPE, typeObj: typeObj}
}

export function setIndexList(listsObj){
  return {type: SET_INDEXLISTS, lists: listsObj}
}

export function submitFeedAssigned(listsObj){
  return {type: SUBMIT_FEEDASSIGN, listsObj: listsObj}
}
