const {
  accountInfoInit,
  i18nUIStringInit,
  messageDialogInit,
} = require('./constants.js');
const {
  staticData
} = require('../../../config/.env.json')

export const initGlobal = {
  userInfo: accountInfoInit, //should change the key:'userInfo' to other else
  token: null,
  i18nUIString: i18nUIStringInit,
  messageSingleClose: messageDialogInit.singleClose,
  messageSingle: messageDialogInit.single,
  messageBoolean: messageDialogInit.boolean,
  guidingNailsId: staticData.guidingNailsId
}

//cnetralize nouns used by the user
export const initNouns = {
  nounsBasic: {

  }
}

export const initUsers = {
  usersBasic: {

  },
  pathsBasic: {

  }
}
