import {
  MOUNT_USERINFO
} from '../constants/general.js';

export function mountUserInfo(obj) {
  return { type: MOUNT_USERINFO, userInfo: obj }
};