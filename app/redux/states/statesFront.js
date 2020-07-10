export const initFront = {
  axios: false, //not a good name, easily confused with other using Axios, like Unit
  userSheet: {
    ify: false,
    gender: "",
  },
  belongsByType: {
    fetched: false,
    fetchedSeries: false,
    setTypesList: [], // [? 'homeland', ? 'residence']
    "homeland": null,
    /*"homelandup": {nodeId, listToTop, topParentId}*/
    /*
    and here is a trick: '...up' obj only true after parent list res,
    could be used as a 'checkpoint' to distinguish if the parent list has res*/
  },
}

//state specific for the 'Setting' part of sheet, for tansfering to a unique page of setting in the future
export const initSheetSetting = {
  accountSet: {
    firstName: "",
    lastName: "",
    mail: ''
  },
}
