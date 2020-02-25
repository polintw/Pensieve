import {
  SET_INDEXLISTS,
} from '../types/typesAround.js';

export function setIndexLists(listsObj){
  return {type: SET_INDEXLISTS, lists: listsObj}
}
