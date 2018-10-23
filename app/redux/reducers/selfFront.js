import {
  MOUNT_USERINFO
} from '../constants/general.js';

const initialGeneral = {
  userInfo: {}
}

function pageSelfFront(state = initialGeneral, action){
  switch (action.type) {
    case MOUNT_USERINFO:
      return Object.assign({}, state, {
        userInfo: action.userInfo
      })
      break;
    default:
      return state
  }
}

export default pageSelfFront
