export const initFront = {
  axios: false, //not a good name, easily confused with other using Axios, like Unit
  userSheet: {
    ify: false,
    gender: "",
    birthYear: "",
    birthMonth:"",
    birthDate: ""
  }
}

//state specific for the 'Setting' part of sheet, for tansfering to a unique page of setting in the future
export const initSheetSetting = {
  accountSet: {
    firstName: "",
    lastName: "",
    mail: ''
  },
}
