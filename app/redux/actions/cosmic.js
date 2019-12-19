import {
  SET_FETCHFLAGS,
} from '../constants/typesGeneral.js';
import {
  SET_INDEXLISTS
} from '../constants/typesCosmic.js';
import {

} from '../constants/constCosmic.js';
import {errHandler_axiosCatch} from "../../utils/errHandlers.js";

export function setFlag(target){
  //this actoin creator, could do function return is because we use 'thunk' middleware when create store
  return (dispatch, getState) => {
    //by this method we could use 'getState' & 'dispatch' in action creator
    const currentState =  getState();
    let currentFlag = currentState[target];

    let flagObj = {};
    flagObj[target] = currentFlag ? false : true;

    let submitObj = {
      type: SET_FETCHFLAGS,
      flags: flagObj
    };
    dispatch(submitObj)
  }
}

export function handFocusListNew(listArr){
  //this actoin creator, could do function return is because we use 'thunk' middleware when create store
  return (dispatch, getState) => {
    //by this method we could use 'getState' & 'dispatch' in action creator
    const prevList =  getState().indexLists.listFocus;
    let nextList = prevList.concat(listArr);

    dispatch({type: SET_INDEXLISTS, lists: {listFocus: nextList}})
  }
}

export function setIndexLists(listsObj){
  return {type: SET_INDEXLISTS, lists: listsObj}
}
