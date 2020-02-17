const {
  accountInfoInit,
  i18nUIStringInit,
  messageDialogInit
} = require('./global.js');

export const initGlobal = {
  userInfo: accountInfoInit, //should change the key:'userInfo' to other else
  token: null,
  i18nUIString: i18nUIStringInit,
  messageSingleClose: null, //format follow Boolean, as [{text: '', style:{}}]
  messageBoolean: messageDialogInit.boolean
}
