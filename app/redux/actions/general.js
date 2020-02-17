import {
  SET_TOKENSTATUS,
  MOUNT_USERINFO,
  AXIOS_SWITCH,
} from '../types/typesGeneral.js';

export function mountUserInfo(obj) {
  return { type: MOUNT_USERINFO, userInfo: obj }
};

export function setTokenStatus(obj) {
  return { type: SET_TOKENSTATUS, status: obj }
};

export function axiosSwitch(bool) {
  return { type: AXIOS_SWITCH, status: bool }
};
