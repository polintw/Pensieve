import {
  SET_FETCHFLAGS,
} from '../constants/typesGeneral.js';
import {
  SET_INDEXLISTS
} from '../constants/typesCosmic.js';
import {
  flagsUpdate_BelongNode
} from '../constants/constCosmic.js';
import {errHandler_axiosCatch} from "../../utils/errHandlers.js";

export function setFetchFlags(fetchTarget){
  let fetchFlags = [];
  //copy the flags import from const file
  //currently theres is only one kind of flags list use this action
  switch (fetchTarget) {
    case 'update_BelongNode':
      fetchFlags = fetchFlags.concat(flagsUpdate_BelongNode);
      break;
    default:
      fetchFlags = []
  }

  return {type: SET_FETCHFLAGS, fetchFlags: fetchFlags}
}

export function rmFetchFlags(rmTarget){
  //this actoin creator, could do function return is because we use 'thunk' middleware when create store
  return (dispatch, getState) => {
    //by this method we could use 'getState' & 'dispatch' in action creator
    const currentFlags =  getState().fetchFlags;
    let index = currentFlags.indexOf(rmTarget),
        nextFlags = currentFlags.slice(); //shallow copy of the currentFlags

    nextFlags.splice(index, 1); //rm the unwanted item from copy arr

    dispatch({type: SET_FETCHFLAGS, fetchFlags: nextFlags})
  }
}

export function setIndexLists(listsObj){
  return {type: SET_INDEXLISTS, lists: listsObj}
}
