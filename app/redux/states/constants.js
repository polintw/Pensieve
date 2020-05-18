
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
  "catalog":{
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
     "message_Resend_PassReset": "Your password has been updated. Please Sign in with new password. ",
     "hint_inputMessage_pw": ["keep the password in same!"],
     "hint_Signup_gendeSelect": "How do you want us to call you?",
     "options_genderPronoun": ["He/Him", "She/Her"],
     "message_Signup_Form": [
       "please fill in the correct form for email address.",
       "First and Last name are required.",
       "please choose your gender, or select desired pronoun by 'Others'."
     ],
     "title_onBoard_Welcome": "welcome, ",
     "descript_onBoard_Intro": ["Cornerth. brings you info from your homeland and current stay.", "Share what’s happening around you and keep up your steps to the fellows from the other side!"],
     "descript_onBoard_BelongsHint": ["Before you start …", "Tell us where are you from?"],
     "guideing_onBoard_BelongsHint": ["I'm from", "Now based at"],
     "submit_onBoard_start": "Let's Start",

     "category_Belongs_": ["Homeland", "Current Stay"],

     "message_hello": "Hi, ",
     "submit_edit": "Edit",
     "submit_save": "Save",
     "submit_erase": "erase",
     "submit_understand": "Understand",
     "submit_respond": "Respond",
     "submit_logout": "Log out",
     "title_share": "Share",
     "Cornerth_inc": "Cornerth., Inc. ",
     "AllRights": "All Rights Reserved.",

     "submit_Options_profile": "My profile",
     "submit_Unit_upload": ["Add image", "Processing..."],
     "descript_Unit_Primer": ["Based on ", "'s Unit", "Based on a published Unit"],
     "guiding_UnitEdit_upload": "Share what you've observed at Your Corner!",
     "guiding_UnitEdit_imgNoMark": "keep it clean or by Clicking make some Post-it without hesitate!",
     "guiding_placeholder_UnitEdit_MarkBlock": "What's SPECIAL!  Telling us some details you found." ,
     "message_UnitEdit_tooManySpot": "A better spot? But too many paragraph would be a burdon to readers. Please delete an old one before you implement this new!",
     "message_UnitEdit_ruleAssignedNodes": ["Select only one corner from where you stay, and one from homeland."],

     "title_shareUpload_typewriter": ['S','h','a','r','e'],
     "guidingCreateShare_AssignGroup": "Share to Fellows from/at",
     "guiding_FeedAssigned_noneAssigned": "Not yet any unit was shared. But let's take a look at other places:",
     "message_Unit_Editing_AssignNotAllowed": "the corner linked to could Not be changed after first release.",
     "message_Unit_EraseConfirm": ["No one would see this Shared after erase, including you. ", "Are you sure your going to erase this Shared?"],
     "message_Unit_EraseRes": ["This Shared has beed erased successfully."],
     "title_FeedAssigned_AllRead": "you've all browsed.",
     "title_FeedAssigned_": "Pool",
     "title_Chain_Shareds_": "My shareds",

     "message_Chain_noShareds": "share a scene to see how people think.",
     "message_Chain_noChain": ["hey, ", ", how's your day?"],
     "message_Chain_byChainInfo": ["your shared had been published successfully.", ["you successfully responds to ", "'s shared."], "responded to your shared.", ["a respond to ", "'s respond to your shared."]],
     "guidingBelongs_EmptyMap": "Set your corner, and taking a look for the distribution of your fellows.",
     "descript_BelongTypeInteract": ["going to renew your ", " ?"],
     "category__Belong_usersCount": ["with ", "users", "way to "],
     "link_BelongsMap_Nav": ["Fellows", "from Home", "same Residence"],
     "messageBelongChoiceinBool": ["site ", "  as your  ", "  place?"],
     "descript_BelongSet_SearchBytType": ["Input corner name of your "],
     "descript_AroundIndex_footer": "You've seen the edge of Cornerth.!",
     "descript_AroundIndex_footer_noshared": "how about yours?",
     'descript_AroundIndex_footer_BelongHint': "start browsing by your current stay or homeland!",
     "guiding_AroundIndex_Share": "Share something",
   }
}
