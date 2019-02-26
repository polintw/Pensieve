import { combineReducers } from 'redux';
import {
  MOUNT_USERINFO,
  SET_UNITCURRENT,
  UNIT_SUBMITTING_SWITCH,
  UPDATE_NOUNSBASIC,
  AXIOS_SWITCH
} from '../constants/typesGeneral.js';
import {
  UPDATE_USERSHEET,
  UPDATE_ACCOUNTSET,
  SETTING_SUBMITTING_SWITCH
} from '../constants/typesSelfFront.js';
import {
  initGlobal,
  initSetting,
  initNouns,
  initSelfFrontGeneral
} from '../constants/states.js';

//this is a temp management, in case one day we will seperate the reducer like the initstate
const initialGeneral = Object.assign({}, initGlobal, initSetting, initNouns, initSelfFrontGeneral);

function pageSelfFront(state = initialGeneral, action){
  switch (action.type) {
    case MOUNT_USERINFO:
      return Object.assign({}, state, {
        userInfo: action.userInfo
      })
      break;
    case SET_UNITCURRENT:
      return Object.assign({}, state, {
        unitCurrent: action.unitCurrent
      })
      break;
    case UNIT_SUBMITTING_SWITCH:
      return Object.assign({}, state, {
        unitSubmitting: action.unitSubmitting
      })
      break;
    case UPDATE_USERSHEET:
      return Object.assign({}, state, {
        userSheet: action.userSheet,
        accountSet: action.accountSet
      })
      break;
    case UPDATE_ACCOUNTSET:
      return Object.assign({}, state, {
        accountSet: action.accountSet
      })
      break;
    case SETTING_SUBMITTING_SWITCH:
        return Object.assign({}, state, {
        settingSubmitting: action.settingSubmitting
      })
      break;
    case UPDATE_NOUNSBASIC:
      return Object.assign({}, state, {
        nounsBasic: {...state.nousBasic, ...action.newFetch}
      })
      break;
    case AXIOS_SWITCH:
      return Object.assign({}, state, {
        axios: action.status
      })
      break;
    default:
      return state
  }
}

export default pageSelfFront
