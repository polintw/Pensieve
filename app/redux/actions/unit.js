import {
  SET_UNITVIEW,
  UNIT_SUBMITTING_SWITCH
} from '../types/typesUnit.js';

export function setUnitView(expression) {
  return { type: SET_UNITVIEW, unitView: expression}
};

export function switchUnitSubmitting(bool) {
  return { type: UNIT_SUBMITTING_SWITCH, unitSubmitting: bool}
};
