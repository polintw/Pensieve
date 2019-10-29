import { combineReducers } from 'redux';
import {
  initGlobal
} from '../constants/states.js';
import {
  SET_TOKENSTATUS,
  MOUNT_USERINFO,
} from '../constants/typesGeneral.js';

const initialGeneral = Object.assign({}, initGlobal);

//actually, there is not too much reason to use redux at this page
function pageAbout(state = initialGeneral, action){
  switch (action.type) {
    case SET_TOKENSTATUS:
      return Object.assign({}, state, {
        ...action.status
      })
      break;
    case MOUNT_USERINFO:
      return Object.assign({}, state, {
        userInfo: action.userInfo
      })
      break;
    default:
      return state
  }
}

export default pageAbout
