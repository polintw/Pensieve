import {
  UNIT_SUBMITTING_SWITCH
} from '../types/typesUnit.js';

export function switchUnitSubmitting(bool) {
  return { type: UNIT_SUBMITTING_SWITCH, unitSubmitting: bool}
};
