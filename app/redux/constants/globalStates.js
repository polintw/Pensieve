
//this file, was prepared to use combined reducers

export const accountInfoInit = {
  account: "",
  firstName: '',
  lastName: '',
  id: null
}

export const unitCurrentInit = {
  unitId:"",
  identity: "",
  authorBasic: {authorId: "", account: '', firstName: '', lastName: ''},
  coverSrc: null,
  beneathSrc: null,
  coverMarksList:[],
  coverMarksData:{},
  beneathMarksList:[],
  beneathMarksData:{},
  nouns: null,
  marksInteraction: {},
  broad: false,
  refsArr: null,
  createdAt: null
}

//here, is the i18n language switch basic, just for the future usage
//ideally the content in "catalog" should be empty, fill in when the root create the store using the data return from backend
//so this is just a temp, lazy way to test this approach
export const i18nUIStringInit = {
  "language":"en",
  "catalog":{
     "helloUser":"Hello, ",
     "welcomeNew": "Congratulations! Discover everything and beyond!",
     "welcomeBack":"Welcome back",
     "greetNight": "Good evening.",
     "greetMorning": "Good morning!",
     "guidingNewBelong": "Which Corner do you Belong ?",
     "guidingEditBelong": "missing another corner?",
     "messageChoiceBelong": ["Which one does the  ", "  match the most?"],
     "hintEmptyNode": "be the first introducing this corner to people!",
     "titleBannerBelong": "new share, around the corner ",
     "titleBannerRest": "new arrived, or selected"
   }
}
