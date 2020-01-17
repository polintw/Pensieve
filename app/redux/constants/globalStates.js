
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
     "title_Main_Broads": ["Broaded", "by people"],
     "catagory_MatchNodes_wished": ["Wish", "Wish·Order"],

     "title_Main_NewCust": ["NEW", "for you"],
     "title_Main_OtherNew": ["NEW", "arrived"],
     "title_Main_matchDemand": ["Taking one!", "these are corners hoping from people."],
     "title_Main_matchSupply": "And people are willing to providing these corners!",
     "title_Main_matchWilling": "Your Providing Menu.",
     "catagory_MatchNodes_willing": ["adding new", "providing", "dedicated to..."],
     "submit_remove": "remove",
     "descript_MatchNodes_demandTaken": "Your Wish now was working by users!",
     "message_Main_duplicateTaking": "There has already been another corner taken on record. Giving up the current one if you wanted to take this new corner.",
     "message_Main_forbbidenWish": "The Wish bucket allow an Order with/or up to 3 wishes. You have to remove some of them before making another one.",
     "hint_Process_MatchTaking": "submitting the corner you taked...",
     "title_Main_matchTaking": ["Taken", "on list", ["Give ", "up"], "Ordered"],
     "message_Main_MatchTakingGiveup": ["There are still ", "users on the list looking forward to any Share about ", ". Are you sure you want to give up the taken?"],
     "link_Main_matchSupplyAction": ["Order", "list me"],
     "category__Belong_usersCount": ["with ", "users", "way to "]
   }
}
