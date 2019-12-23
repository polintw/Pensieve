
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
     "guidingBelong_New": "Focus on the corner around you!",
     "guidingBelong_NewSet": "Any Corner below around your life?",
     "guidingBelong_EditReset": "Recruiting the Corner whether fresh or mature in your surrounding!",
     "guidingBelong_Edit": "Open out new Corner and unbox you world!",
     "guidingShare_atBelong": "Let’s get started off!",
     "guidingBroad_atMain": "Go Broadcasting the Shared you like!",
     "descript_BelongTypeInteract": ["going to renew your ", " ?"],
     "descript_Nail_BroadList": [" broadcast this Shared.", "and more all"],
     "descript_Unit_BroadList": ["broadcast this Shared", "and more all"],
     "descript_Unit_Author_read": ["reach to", "reach"],
     "descript_Unit_Author_broad": ["broad by", "broad"],
     "messageChoiceBelong": ["Which living field below is ", " around over most?"],
     "messageBelongChoiceinBool": ["site ", "  as your  ", "  place?"],
     "hintEmptyNode": "This Corner is still Waiting to be explored. Be the first one to wonder and wander!",
     "titleBannerBelong": "new shared.",
     "titleBannerRest": "newly arrived or selected.",
     "title_Main_Broads": "or, here are some broaded by users.",

     "hintEmptyNode_contributors": "waiting for someone, perhaps that's just you! ",
     "hintEmptyUsers_accumulated": "Still wondering and wandering~~ ",
     "hintEmptySelf_Inspired": '(not yet established. expect to inform user the "inepired" Unit would emerge here.)',
     "hintEmptySelf_Broaded": '(not yet established. expect to inform user the "broaded" Unit would emerge here.)',
     "guidingExplore_NodesMore": [" more ", "or, touch", "to find out where you can be the First! "],
     "guidingSelf_empty_Shared": '(not yet established. expect to guide user "share something" by the add button)',
     "guidingSign_Confirm_Success": ["Email address has successfully verified.", "Log in and start your adventure to the World!"],
     "guidingSign_Confirm_Fail": ["Email address verified failed.", "It's probablly due to the valid time was over.", "Or, haven't received the verified mail?"],
     "guidingSign_Signup_Success": [
       "You've already signed up, but don't move too fast!",
       "Verifing your Email Address by Mail we just sent to you.",
       "You would get all settle after the Verifing."
     ],
     "descript_NotifyBox_Ispired": " was inspired by one of your paragraph.",
     "descript_Sign_termsDeclaim": [
       "By clicking “sign up”, you agree our", " Terms", " of Services and ", "Privacy Policy", "."],
     "title_Sign_mailResend": "Fill in your email address to re-send a verified email again.",
     "link_Sign_resendButton": "confirm re-send",
     "link_Sign_mailResend": "send the verified email again",

   }
}
