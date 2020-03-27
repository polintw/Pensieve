const {
  i18nUIStringInit,
  messageDialogInit
} = require('./constants.js');

export const initSign = {
  axios: false,
  message:'',
  code: '',
  i18nUIString: i18nUIStringInit, //this Sign, should not have other state in Global like 'token', but we still need i18nUIString
  messageSingle: messageDialogInit.single,
}
