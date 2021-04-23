const {
  unitCurrentInit
} = require('./constants.js');

export const initUnit = {
  unitCurrent: unitCurrentInit,
  unitCurrentResponds: {list:[], scrolled: true},
  unitSubmitting: false,
  unitView: 'theater',
  unitSubCate: { next_confirm: false, next_unit: null, first_unit: null}
}
