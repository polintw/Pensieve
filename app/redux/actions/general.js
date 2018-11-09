import {
  MOUNT_USERINFO,
  UNIT_MOUNT_UNITCURRENT
} from '../constants/general.js';

export function mountUserInfo(obj) {
  return { type: MOUNT_USERINFO, userInfo: obj }
};

export function mountUnitCurrent(obj) {
  return { type: UNIT_MOUNT_UNITCURRENT, unitCurrent: obj }
};
