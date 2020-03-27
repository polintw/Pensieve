
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
  refsArr: null,
  createdAt: null
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
  "catalog":{
     "welcomeNew": "Welcome to join Cornerth. Here you can discover every hidden thing and more!",
     "welcomeBack":"Welcome back",
     "greetNight": "Good evening.",
     "greetMorning": "Good morning!",
     "descript_Unit_Author_read": ["reach to", "reach"],
     "descript_Unit_Author_broad": ["broad by", "broad"],
     "guidingSign_Confirm_Success": ["Email address has successfully verified.", "Log in and start your adventure to the World!"],
     "guidingSign_Confirm_Fail": ["Email address verified failed.", "It's probablly due to the valid time was over.", "Or, haven't received the verified mail?"],
     "link_Sign_mailResend": "send the verified email again",
     "title_Sign_mailResend": ["Fill in your email address to re-send a verified email again.", "Fill in the email of your account. "],
     "title_Sign_pwReset": "Now please enter New Password.",
     "link_Sign_resendButton": "submit",
     "guidingSign_Signup_Success": [
       "You've already signed up, but don't move too fast!",
       "Verifing your Email Address by Mail we just sent to you.",
       "You would get all settle after the Verifing."
     ],
     "descript_Sign_termsDeclaim": [
       "By clicking “sign up”, you agree our", " Terms", " of Services and ", "Privacy Policy", "."],
     "guidingCreateShare_AssignGroup": "sharing to people linked to which of your corner?",
     "guiding_FeedAssigned_noBelongHint": "Setting your homeland or current stay before geting news from your fellows!",
     "guiding_FeedAssigned_noneAssigned": "how's your home going?",
     "message_Unit_Editing_AssignNotAllowed": "the corner linked to could Not be changed after first release.",
     "message_Unit_EraseConfirm": ["No one would see this Shared after erase, including you. ", "Are you sure your going to erase this Shared?"],
     "message_Unit_EraseRes": ["This Shared has beed erased successfully."],
     "title_FeedAssigned_AllRead": "you've all browsed.",
     "catagory_indexChain_NailTypes": ["shared", "respond", "to respond", "last shared"],
     "guidingBelongs_EmptyMap": "Set your corner, and taking a look for the distribution of your fellows.",
     "descript_BelongTypeInteract": ["going to renew your ", " ?"],
     "category__Belong_usersCount": ["with ", "users", "way to "],
     "link_BelongsMap_Nav": ["Fellows", "from Home", "same Residence"],
     "submit_edit": "edit",
     "messageBelongChoiceinBool": ["site ", "  as your  ", "  place?"],
     "descript_BelongSet_SearchBytType": ["Input corner name of your "],
     "guidingChain_noBelongSet": "Touching your Fellows by setting the place you are and the land you were born.",
     "guidingChain_noSharedEst.": ["You would be the first one to share about your corner."],
     "message_Resend_PassReset": "Your password has been updated. Please Sign in with new password. ",
     "hint_inputMessage_pw": ["keep the password in same!"],


     "hintEmptyNode": "This Corner is still Waiting to be explored. Be the first one to wonder and wander!",
     "hintEmptyNode_contributors": "waiting for someone, perhaps that's just you! ",
     "guidingExplore_NodesMore": [" more ", "or, touch", "to find out where you can be the First! "],

   }
}
