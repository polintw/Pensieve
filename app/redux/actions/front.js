import {
  UPDATE_USERSHEET,
  SETTING_SUBMITTING_SWITCH
} from '../types/typesFront.js';

export function mountUserSheet(sheetObj, accountSet) {
  return { type: UPDATE_USERSHEET, userSheet: sheetObj, accountSet: accountSet}
};

export function switchSettingSubmitting(bool) {
  return { type: SETTING_SUBMITTING_SWITCH, settingSubmitting: bool}
};
