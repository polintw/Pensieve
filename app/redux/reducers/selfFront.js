import { combineReducers } from 'redux';
import {
  MOUNT_USERINFO,
  AXIOS_SWITCH
} from '../types/typesGeneral.js';
import {
  UPDATE_USERSHEET,
  UPDATE_ACCOUNTSET,
  SETTING_SUBMITTING_SWITCH
} from '../types/typesFront.js';
import {
  initGlobal,
} from '../states/states.js';
import {
  initFront,
  initSheetSetting
} from '../states/statesFront.js';

//this is a temp management, in case one day we will seperate the reducer like the initstate
const initialGeneral = Object.assign({}, initGlobal, initSheetSetting, initFront);

function pageSelfFront(state = initialGeneral, action){
  switch (action.type) {
    case MOUNT_USERINFO:
      return Object.assign({}, state, {
        userInfo: action.userInfo
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
