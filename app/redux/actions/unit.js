import {
  SET_UNITVIEW,
  SET_UNITSUBCATE,
  UNIT_SUBMITTING_SWITCH
} from '../types/typesUnit.js';
import {
  initUnit
} from "../states/statesUnit.js";

export function setUnitView(expression) {
  return { type: SET_UNITVIEW, unitView: expression}
};

export function setUnitSubcate(expression) {
  return { type: SET_UNITSUBCATE, unitSubCate: expression}
};

export function switchUnitSubmitting(bool) {
  return { type: UNIT_SUBMITTING_SWITCH, unitSubmitting: bool}
};
