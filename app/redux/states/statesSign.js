const {
  i18nUIStringInit,
} = require('./global.js');

export const initSign = {
  axios: false,
  message:'',
  code: '',
  i18nUIString: i18nUIStringInit //this Sign, should not have other state in Global like 'token', but we still need i18nUIString
}
