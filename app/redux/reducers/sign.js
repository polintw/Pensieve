import { combineReducers } from 'redux';
import {
  initSign
} from '../constants/states.js';
import {
  AXIOS_SWITCH,
  AXIOS_GET_RES
} from '../constants/typesGeneral.js';

const initialGeneral = Object.assign({}, initSign);

//actually, there is not too much reason to use redux at this page
function pageSign(state = initialGeneral, action){
  switch (action.type) {
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
