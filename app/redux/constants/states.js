const {
  unitCurrentInit,
  accountInfoInit,
  i18nUIStringInit
} = require('./globalStates.js');

export const initGlobal = {
  userInfo: accountInfoInit, //should change the key:'userInfo' to other else
  i18nUIString: i18nUIStringInit,
  token: null
}

export const initSign = {
  axios: false,
  message:'',
  code: ''
}

export const initUnit = {
  unitCurrent: unitCurrentInit,
  unitSubmitting: false,
  unitAxiosInspire: false
}

export const initCosmicGeneral = {
  flagBelongRefresh: false,
  flagWishRefresh: false,
  flagNewSharedDataFetch: false,
  indexLists: {
    listCustomNew: [],
    listNew: [],
    listFocus:[],
    demandTake: [],
    todayNode: [],
    broads: []
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
