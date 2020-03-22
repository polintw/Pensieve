import {
  SET_BELONGSBYTYPE,
  SUBMIT_FEEDASSIGN
} from '../types/typesWithin.js';

export function setBelongsByType(typeObj){
  return {type: SET_BELONGSBYTYPE, typeObj: typeObj}
}

export function submitFeedAssigned(listsObj){
  return {type: SUBMIT_FEEDASSIGN, listsObj: listsObj}
}
