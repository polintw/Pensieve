import {
  MOUNT_USERINFO,
  UNIT_MOUNT_UNITCURRENT
} from '../constants/typesGeneral.js';
import {
  UPDATE_USERSHEET
} from '../constants/typesSelfFront.js';

export function mountUserInfo(obj) {
  return { type: MOUNT_USERINFO, userInfo: obj }
};

export function mountUnitCurrent(obj) {
  return { type: UNIT_MOUNT_UNITCURRENT, unitCurrent: obj }
};

export function mountUserSheet(sheetObj, accountSet) {
  return { type: UPDATE_USERSHEET, userSheet: sheetObj, accountSet: accountSet}
};
