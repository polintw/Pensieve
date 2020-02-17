import {
  SET_FOCUSLISTS,
} from '../types/typesCosmic.js';

export function handFocusListNew(listArr){
  //this actoin creator, could do function return is because we use 'thunk' middleware when create store
  return (dispatch, getState) => {
    //by this method we could use 'getState' & 'dispatch' in action creator
    const prevList =  getState().focusLists.listFocus;
    let nextList = prevList.concat(listArr);

    dispatch({type: SET_FOCUSLISTS, lists: {listFocus: nextList}})
  }
}

export function setFocusLists(listsObj){
  return {type: SET_FOCUSLISTS, lists: listsObj}
}
