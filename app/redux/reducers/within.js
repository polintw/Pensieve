import { combineReducers } from 'redux';
import {
  MOUNT_USERINFO,
  SET_MESSAGE_SINGLE,
  SET_MESSAGE_SINGLECLOSE,
  SET_MESSAGE_BOOLEAN,
  SET_FETCHFLAGS,
  SET_UNITCURRENT,
  SET_TOKENSTATUS,
  SET_BELONGSBYTYPE,
  UPDATE_NOUNSBASIC,
  UPDATE_USERSBASIC,
  UPDATE_PATHSBASIC
} from '../types/typesGeneral.js';
import {
  SET_INDEXLISTS,
  SUBMIT_FEEDASSIGN,
  SUBMIT_CHAINLIST,
  SUBMIT_SHAREDSLIST,
  SET_FLAG_CHAINRESPOND
} from '../types/typesWithin.js';
import {
  SET_UNITVIEW,
  SET_UNITSUBCATE,
  SUBMIT_UNITRESPONDSLIST,
  UNIT_SUBMITTING_SWITCH
} from '../types/typesUnit.js';
import {
  initGlobal,
  initNouns,
  initUsers
} from '../states/states.js';
import {initUnit} from '../states/statesUnit.js';
import {
  initWithin,
  initCosmic,
  initAround
} from '../states/statesWithin.js'

//this is a temp management, in case one day we will seperate the reducer like the initstate
const initialGeneral = Object.assign({}, initGlobal, initWithin, initCosmic, initAround, initUnit, initNouns, initUsers);

function pageWithin(state = initialGeneral, action){
  switch (action.type) {
    case MOUNT_USERINFO:
      return Object.assign({}, state, {
        userInfo: {...state.userInfo, ...action.userInfo}
      })
      break;
    case SET_MESSAGE_SINGLE:
      return Object.assign({}, state, {
        messageSingle: action.messageSingle
      })
      break;
    case SET_MESSAGE_SINGLECLOSE:
      return Object.assign({}, state, {
        messageSingleClose: action.messageSingleClose
      })
      break;
    case SET_MESSAGE_BOOLEAN:
      return Object.assign({}, state, {
        messageBoolean: action.messageBoolean
      })
      break;
    case SET_FETCHFLAGS:
      return Object.assign({}, state, {...action.flags}) //there were many kind of flags, all binary(bool), and all set by this case.
      break;
    case SET_TOKENSTATUS:
      return Object.assign({}, state, {
        ...action.status
      })
      break;
    case SET_UNITVIEW:
      return Object.assign({}, state, {
        unitView: action.unitView
      })
      break;
    case SET_UNITSUBCATE:
      return Object.assign({}, state, {
        unitSubCate: {...state.unitSubCate, ...action.unitSubCate}
      })
      break;
    case SET_UNITCURRENT:
      return Object.assign({}, state, {
        unitCurrent: {...state.unitCurrent, ...action.unitCurrent}
      })
      break;
    case SET_BELONGSBYTYPE:
      return Object.assign({}, state, {
        belongsByType: {...state.belongsByType, ...action.typeObj}
      })
      break;
    case SET_INDEXLISTS:
      return Object.assign({}, state, {
        indexLists: {...state.indexLists, ...action.lists}
      })
      break;
    case SUBMIT_FEEDASSIGN:
      return Object.assign({}, state, {
        indexLists: { ...state.indexLists, ...action.listsObj }
      })
      break;
    case SUBMIT_CHAINLIST:
      return Object.assign({}, state, {
        chainList: { ...state.chainList, ...action.listsObj}
      })
      break;
    case SUBMIT_SHAREDSLIST:
      return Object.assign({}, state, {
        sharedsList: { ...state.sharedsList, ...action.listsObj}
      })
      break;
    case SUBMIT_UNITRESPONDSLIST:
      return Object.assign({}, state, {
        unitCurrentResponds: {...state.unitCurrentResponds, ...action.listsObj}
      })
      break;
    case SET_FLAG_CHAINRESPOND:
      return Object.assign({}, state, {
        flagChainFetRespond: action.bool
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
    case UPDATE_PATHSBASIC:
      return Object.assign({}, state, {
        pathsBasic: {...state.pathsBasic, ...action.newFetch}
      })
      break;
    case UNIT_SUBMITTING_SWITCH:
      return Object.assign({}, state, {
        unitSubmitting: action.unitSubmitting
      })
      break;
    default:
      return state
  }
}

export default pageWithin
