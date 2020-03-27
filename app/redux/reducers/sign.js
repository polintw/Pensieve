import { combineReducers } from 'redux';
import {
  initSign
} from '../states/statesSign.js';
import {
  SET_SIGNINIT,
  SET_RESCODE,
  AXIOS_GET_RES
} from '../types/typesSign.js';
import {
  AXIOS_SWITCH,
  SET_MESSAGE_SINGLE
} from '../types/typesGeneral.js';


const initialGeneral = Object.assign({}, initSign);

//actually, there is not too much reason to use redux at this page
function pageSign(state = initialGeneral, action){
  switch (action.type) {
    case SET_SIGNINIT:
      return Object.assign({}, state, action.initState)
      break;
    case SET_RESCODE:
      return Object.assign({}, state, {
        code: action.code
      })
      break;
    case SET_MESSAGE_SINGLE:
      return Object.assign({}, state, {
        messageSingle: action.messageSingle
      })
      break;
    case AXIOS_SWITCH:
      return Object.assign({}, state, {
        axios: action.status
      })
      break;
    case AXIOS_GET_RES:
      return Object.assign({}, state, {
        axios: action.status,
        message: action.message
      })
      break;
    default:
      return state
  }
}

export default pageSign
