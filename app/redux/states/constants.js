const i18nUIString = require('./i18nUIString.js');

export const accountInfoInit = {
  account: "",
  accountStatus: '',
  firstName: '',
  lastName: '',
  id: null,
  pathProject: null, // 'name' of the project
  pathName: null // be 'null' to make a bool check
}

export const unitCurrentInit = {
  unitId:"",
  identity: "",
  authorBasic: {
    authorId: "", account: '', authorIdentity: '',
    firstName: '', lastName: '' // no this row if authorIdentity is not 'user'
  },
  coverSrc: null,
  beneathSrc: null,
  coverMarksList:[],
  coverMarksData:{},
  beneathMarksList:[],
  beneathMarksData:{},
  nouns: {list:[]},
  refsArr: null,
  outBoundLink: {main: null},
  imgLocation: { longitude: null, latitude: null },
  createdAt: null,
  primerify: false,
  primer: {primerId: '', authorPrimer: ''},
  primerSrc: null
}

export const messageDialogInit= {
  singleClose: {
    render: false,
    message: [/*{text: '', style:{}}*/],
    handlerPositive: ()=>{}
  },
  single: {
    render: false,
    message: [/*{text: '', style:{}}*/],
    handlerPositive: ()=>{},
    buttonValue: null
  },
  boolean: {
    render: false,
    customButton: null,
    message: [/*{text: '', style:{}}*/],
    handlerPositive: ()=>{},
    handlerNegative: ()=>{}
  }
}

//here, is the i18n language switch basic, just for the future usage
//ideally the content in "catalog" should be empty, fill in when the root create the store using the data return from backend
//so this is just a temp, lazy way to test this approach
export const i18nUIStringInit = {
  "language":"en",
  catalog: i18nUIString
}
