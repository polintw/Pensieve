
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

     "title_Main_Broads": ["Broaded", "by people"],
     "catagory_MatchNodes_wished": ["Wish", "Wish·Order"],

     "title_index_CusSelected": "Selections",
     "title_index_SelfShared": "Shared View",
     "title_Main_NewCust": ["NEW", "for you"],
     "title_Main_OtherNew": ["NEW", "arrived"],
     "title_Main_matchDemand": ["Taking one!", "these are corners hoping from people."],
     "title_Main_matchSupply": "And people are willing to providing these corners!",
     "title_Main_matchWilling": "Your Providing Menu.",
     "catagory_MatchNodes_willing": ["adding new", "providing", "dedicated to..."],
     "submit_remove": "remove",
     "submit_edit": "edit",
     "descript_MatchNodes_demandTaken": "Your Wish now was working by users!",
     "message_Main_duplicateTaking": "There has already been another corner taken on record. Giving up the current one if you wanted to take this new corner.",
     "message_Main_forbbidenWish": "The Wish bucket allow an Order with/or up to 3 wishes. You have to remove some of them before making another one.",
     "hint_Process_MatchTaking": "submitting the corner you taked...",
     "title_Main_matchTaking": ["Taken", "on list", ["Give ", "up"], "Ordered"],
     "message_Main_MatchTakingGiveup": ["There are still ", "users on the list looking forward to any Share about ", ". Are you sure you want to give up the taken?"],
     "link_Main_matchSupplyAction": ["Order", "list me"],
     "link_BelongsMap_Nav": ["Fellows", "from Home", "same Residence"],
     "category__Belong_usersCount": ["with ", "users", "way to "],
     "descript_BelongSet_SearchBytType": ["Input corner name of your "],
     "guidingBelongs_EmptyMap": "Set your corner, and taking a look for the distribution of your fellows.",
     "guidingChain_noBelongSet": "Touching your Fellows by setting the place you are and the land you were born.",
     "guidingChain_noSharedEst.": ["You would be the first one to share about your corner!", "Let's first see other corner people shared to their fellows."],
     "guidingChain_Upload_noSharedEst.":　"So, which corner in your mind do you want to share?",
     "guidingChain_Upload_aShared": "what's yours?",
     "guidingCreateShare_AssignGroup": "sharing to people linked to which of your corner?",
     "guiding_FeedAssigned_noBelongHint": "Setting your homeland or current stay before geting news from your fellows!",
     "guiding_FeedAssigned_noneAssigned": "how's your home going?",
     "message_Unit_Editing_AssignNotAllowed": "the corner linked to could Not be changed after first release.",
     "message_Unit_EraseConfirm": ["No one would see this Shared after erase, including you. ", "Are you sure your going to erase this Shared?"],
     "message_Unit_EraseRes": ["This Shared has beed erased successfully."],
     "title_FeedAssigned_AllRead": "you've all browsed."
   }
}
