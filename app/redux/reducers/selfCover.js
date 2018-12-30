import { combineReducers } from 'redux';
import {
  MOUNT_USERINFO,
  UNIT_MOUNT_UNITCURRENT,
  UPDATE_NOUNSBASIC
} from '../constants/typesGeneral.js';
import {
  initGlobal,
  initNouns
} from '../constants/states.js';

//this is a temp management, in case one day we will seperate the reducer like the initstate
const initialGeneral = Object.assign({}, initGlobal, initNouns);

function pageSelfCover(state = initialGeneral, action){
  switch (action.type) {
    case MOUNT_USERINFO:
      return Object.assign({}, state, {
        userInfo: action.userInfo
      })
      break;
    case UNIT_MOUNT_UNITCURRENT:
      return Object.assign({}, state, {
        unitCurrent: action.unitCurrent
      })
      break;
    case UPDATE_NOUNSBASIC:
      return Object.assign({}, state, {
        nounsBasic: {...state.nousBasic, ...action.newFetch}
      })
      break;
    default:
      return state
  }
}

export default pageSelfCover
