
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

export const messageDialogInit= {
  boolean: {
    render: false,
    customButton: null,
    message: '',
    handlerPositive: ()=>{},
    handlerNegative: ()=>{}
  }
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

     removed part in Main
     */
     "title_Main_Broads": "Broaded by users",
     "catagory_MatchNodes_wished": ["Wish", "Wish·Order"],

     "title_Main_NewCust": "New for you",
     "title_Main_OtherNew": "Newly arrived",
     "title_Main_matchDemand": "Picking a corner, Sharing the thing you know.",
     "title_Main_matchSupply": "Corners incubating...",
     "title_Main_matchWilling": "corners you are willing to dedicate: ",
     "catagory_MatchNodes_willing": ["set", "dedicated corner"],
     "submit_remove": "remove",
     "descript_MatchNodes_demandTaken": "Some users' begun working on your wish!",
     "message_Main_duplicateTaking": "There has already been another corner taken on record. Giving up the current one if you wanted to take this new corner.",
     "message_Main_forbbidenWish": "The Wish bucket allow an Order with/or up to 3 wishes. You have to remove some of them before making another one.",
     "hint_Process_MatchTaking": "submitting the corner you taked...",
     "title_Main_matchTaking": ["Taken", "on list", "Give up"],
     "message_Main_MatchTakingGiveup": ["There are still ", "users on the list looking forward to any Share about ", ". Are you sure you want to give up the taken?"],
     "link_Main_matchSupplyAction": ["Order", "list me"]
   }
}
