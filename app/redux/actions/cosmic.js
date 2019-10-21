import {
  SET_INDEXLISTS
} from '../constants/typesCosmic.js';
import {errHandler_axiosCatch} from "../../utils/errHandlers.js";

export function setIndexLists(listsObj){
  return {type: SET_INDEXLISTS, lists: listsObj}
}
