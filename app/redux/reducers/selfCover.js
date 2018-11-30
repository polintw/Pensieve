import { combineReducers } from 'redux';
import {
  MOUNT_USERINFO,
  UNIT_MOUNT_UNITCURRENT
} from '../constants/typesGeneral.js';
import {
  initGlobal
} from '../constants/states.js';

function pageSelfCover(state = initGlobal, action){
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
    default:
      return state
  }
}

export default pageSelfCover
