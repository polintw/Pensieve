const {unitCurrentInit, accountInfoInit} = require('./globalStates.js');

export const initSign = {
  axios: false,
  message:'',
  code: ''
}

export const initGlobal = {
  userInfo: accountInfoInit, //should change the key:'userInfo' to other else
  unitCurrent: unitCurrentInit,
  unitSubmitting: false
}

export const initSelfFrontGeneral = {
  axios: false,
  userSheet: {
    ify: false,
    gender: "",
    birthYear: "",
    birthMonth:"",
    birthDate: ""
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
