
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
     "welcomeNew": "Welcome to join Cornerth. Here you can discover every hidden thing and more!",
     "welcomeBack":"Welcome back",
     "greetNight": "Good evening.",
     "greetMorning": "Good morning!",
     /*"guidingBelong_New": "Focus on the corner around you!",
     "guidingBelong_NewSet": "Any Corner below around your life?",
     "guidingBelong_EditReset": "Recruiting the Corner whether fresh or mature in your surrounding!",
     "guidingBelong_Edit": "Open out new Corner and unbox you world!",
     "guidingShare_atBelong": "Let’s get started off!",
     all above are used only in removed file "BelongForm"
     */
     "guidingBroad_atMain": "Go Broadcasting the Shared you like!",
     "descript_BelongTypeInteract": ["going to renew your ", " ?"],
     "descript_Nail_BroadList": [" broadcast this Shared.", "and more all"],
     "descript_Unit_BroadList": ["broadcast this Shared", "and more all"],
     "descript_Unit_Author_read": ["reach to", "reach"],
     "descript_Unit_Author_broad": ["broad by", "broad"],
     "messageChoiceBelong": ["Which living field below is ", " around over most?"],
     "messageBelongChoiceinBool": ["site ", "  as your  ", "  place?"],
     "hintEmptyNode": "This Corner is still Waiting to be explored. Be the first one to wonder and wander!",
     /*"titleBannerBelong": "new shared.",
     "titleBannerRest": "newly arrived or selected.",

     removed part in Main
     */
     "title_Main_Broads": "or, here are some broaded by users.",
     "catagory_MatchNodes_wished": ["Wish", "Wish·Order"],

     "title_Main_matchWilling": "corners you are willing to dedicate: ",
     "catagory_MatchNodes_willing": ["set", "dedicated corner"],
     "submit_remove": "remove",
     "descript_MatchNodes_demandTaken": "Some users' begun working on your wish!",
   }
}
