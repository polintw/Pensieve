import {
  MOUNT_USERINFO,
  UNIT_MOUNT_UNITCURRENT
} from '../constants/general.js';

const initialGeneral = {
  userInfo: {},
  unitCurrent: {unitId:"", identity: ""}
}

function pageSelfFront(state = initialGeneral, action){
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

export default pageSelfFront
