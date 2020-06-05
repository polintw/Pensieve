import {
  SET_UNITVIEW,
  SUBMIT_UNITRESPONDSLIST,
  UNIT_SUBMITTING_SWITCH
} from '../types/typesUnit.js';
import {
  initUnit
} from "../states/statesUnit.js";

export function setUnitView(expression) {
  return { type: SET_UNITVIEW, unitView: expression}
};

export function switchUnitSubmitting(bool) {
  return { type: UNIT_SUBMITTING_SWITCH, unitSubmitting: bool}
};

export function submitUnitRespondsList(list, reset){
  return (dispatch, getState) => {
    const currentState =  getState();
    let copyStateList = currentState.unitCurrentResponds.list.slice();
    let scrolled = listsObj.scrolled; // only this one follow the param directly

    if(list.length > 0) copyStateList.push(list);
    if(!!reset){ // special condition, ask to reset to init state
      copyStateList = initUnit.unitCurrentResponds.list;
      scrolled = initUnit.unitCurrentResponds.scrolled;
    }

    dispatch({
      type: SUBMIT_UNITRESPONDSLIST,
      listsObj: {list: copyStateList, scrolled: scrolled}
    });
  }
}
