import {
  SET_FETCHTOKEN,
} from '../constants/typesGeneral.js';
import {
  SET_INDEXLISTS
} from '../constants/typesCosmic.js';
import {errHandler_axiosCatch} from "../../utils/errHandlers.js";

export function setFetchToken(fetchTarget){
  return {type: SET_FETCHTOKEN, fetchToken: fetchTarget}
}

export function setIndexLists(listsObj){
  return {type: SET_INDEXLISTS, lists: listsObj}
}
