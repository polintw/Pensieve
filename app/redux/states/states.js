const {
  accountInfoInit,
  i18nUIStringInit,
  messageDialogInit,
} = require('./constants.js');

export const initGlobal = {
  userInfo: accountInfoInit, //should change the key:'userInfo' to other else
  token: null,
  i18nUIString: i18nUIStringInit,
  messageSingleClose: messageDialogInit.singleClose,
  messageSingle: messageDialogInit.single,
  messageBoolean: messageDialogInit.boolean,
  guidingNailsId: ["0c1707iab5id31i83b8", null]
}

//cnetralize nouns used by the user
export const initNouns = {
  nounsBasic: {

  }
}

export const initUsers = {
  usersBasic: {

  }
}
