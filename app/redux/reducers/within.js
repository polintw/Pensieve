import { combineReducers } from 'redux';
import {
  MOUNT_USERINFO,
  SET_UNITCURRENT,
  SET_UNITINSPIRED,
  SET_MESSAGE_SINGLECLOSE,
  SET_UNITBROAD,
  SET_FETCHFLAGS,
  UNIT_SUBMITTING_SWITCH,
  UNIT_AXIOSINSPIRE_SWITCH,
  UPDATE_NOUNSBASIC,
  UPDATE_USERSBASIC
} from '../constants/typesGeneral.js';
import {
  SET_INDEXLISTS
} from '../constants/typesCosmic.js';
import {
  initGlobal,
  initCosmicGeneral,
  initUnit,
  initNouns,
  initUsers
} from '../constants/states.js';

//this is a temp management, in case one day we will seperate the reducer like the initstate
const initialGeneral = Object.assign({}, initGlobal, initCosmicGeneral, initUnit, initNouns, initUsers);

function pageWithin(state = initialGeneral, action){
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
    case SET_UNITINSPIRED:
      return Object.assign({}, state, {
        unitCurrent: {...state.unitCurrent, ...action.nextMarksInteraction}
      })
      break;
    case SET_MESSAGE_SINGLECLOSE:
      return Object.assign({}, state, {
        messageSingleClose: action.messageSingleClose
      })
      break;
    case SET_UNITBROAD:
      return Object.assign({}, state, {
        unitCurrent: {...state.unitCurrent, ...action.unitBroad}
      })
      break;
    case SET_FETCHFLAGS:
      return Object.assign({}, state, {...action.flags}) //there were many kind of flags, all binary(bool), and all set by this case.
      break;
    case SET_INDEXLISTS:
      return Object.assign({}, state, {
        indexLists: {...state.indexLists, ...action.lists}
      })
      break;
    case UNIT_SUBMITTING_SWITCH:
      return Object.assign({}, state, {
        unitSubmitting: action.unitSubmitting
      })
      break;
    case UNIT_AXIOSINSPIRE_SWITCH:
      return Object.assign({}, state, {
        unitAxiosInspire: action.unitAxiosInspire
      })
      break;
    case UPDATE_NOUNSBASIC:
      return Object.assign({}, state, {
        nounsBasic: {...state.nounsBasic, ...action.newFetch}
      })
      break;
    case UPDATE_USERSBASIC:
      return Object.assign({}, state, {
        usersBasic: {...state.usersBasic, ...action.newFetch}
      })
      break;
    default:
      return state
  }
}

export default pageWithin
