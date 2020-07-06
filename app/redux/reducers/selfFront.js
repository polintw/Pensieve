import { combineReducers } from 'redux';
import {
  MOUNT_USERINFO,
  SET_TOKENSTATUS,
  SET_BELONGSBYTYPE,
  UPDATE_NOUNSBASIC,
  AXIOS_SWITCH
} from '../types/typesGeneral.js';
import {
  UPDATE_USERSHEET,
} from '../types/typesFront.js';
import {
  initGlobal,
  initNouns,
} from '../states/states.js';
import {
  initFront,
  initSheetSetting
} from '../states/statesFront.js';

//this is a temp management, in case one day we will seperate the reducer like the initstate
const initialGeneral = Object.assign({}, initGlobal, initSheetSetting, initFront, initNouns);

function pageSelfFront(state = initialGeneral, action){
  switch (action.type) {
    case MOUNT_USERINFO:
      return Object.assign({}, state, {
        userInfo: {...state.userInfo, ...action.userInfo}
      })
      break;
    case SET_BELONGSBYTYPE:
      return Object.assign({}, state, {
        belongsByType: {...state.belongsByType, ...action.typeObj}
      })
      break;
    case SET_TOKENSTATUS:
      return Object.assign({}, state, {
        ...action.status
      })
      break;
    case UPDATE_NOUNSBASIC:
      return Object.assign({}, state, {
        nounsBasic: {...state.nounsBasic, ...action.newFetch}
      })
      break;
    case UPDATE_USERSHEET:
      return Object.assign({}, state, {
        userSheet: action.userSheet,
        accountSet: action.accountSet
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
