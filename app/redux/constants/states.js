const {
  unitCurrentInit,
  accountInfoInit,
  i18nUIStringInit,
  messageDialogInit
} = require('./globalStates.js');

export const initGlobal = {
  userInfo: accountInfoInit, //should change the key:'userInfo' to other else
  token: null,
  i18nUIString: i18nUIStringInit,
  messageSingleClose: null, //format follow Boolean, as [{text: '', style:{}}]
  messageBoolean: messageDialogInit.boolean
}

export const initSign = {
  axios: false,
  message:'',
  code: '',
  i18nUIString: i18nUIStringInit //this Sign, should not have other state in Global like 'token', but we still need i18nUIString
}

export const initUnit = {
  unitCurrent: unitCurrentInit,
  unitSubmitting: false,
  unitAxiosInspire: false
}

export const initCosmicGeneral = {
  flagBelongRefresh: false,
  flagTakingRefresh: false,
  flagWishRefresh: false,
  flagNewCustomDataFetch: false,
  flagNewSharedDataFetch: false,
  axiosMatchTaking: false,
  focusLists: {
    listFocus:[],
    listNew: [],
    broads: []
  },
  indexLists: {
    listCustomNew: [],
    listCustomSelected: [],
    listSelfShared: []
  }
}

export const initSelfFrontGeneral = {
  axios: false, //not a good name, easily confused with other using Axios, like Unit
  userSheet: {
    ify: false,
    gender: "",
    birthYear: "",
    birthMonth:"",
    birthDate: ""
  },
  cognition: {
    bellNotify: false,
    listNotify: []
  }
}

//state specific for the 'Setting' part of sheet, for tansfering to a unique page of setting in the future
export const initSetting = {
  accountSet: {
    firstName: "",
    lastName: "",
    mail: ''
  },
  settingSubmitting: false
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
