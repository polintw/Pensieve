import {
  UPDATE_USERSHEET,
} from '../types/typesFront.js';

export function mountUserSheet(sheetObj, accountSet) {
  return { type: UPDATE_USERSHEET, userSheet: sheetObj, accountSet: accountSet}
};
