import {
  domain
} from '../../config/services.js';
import i18nUIString_EN from '../redux/states/i18nUIString.js';

// in the future, we can switch language with i18nUIString here,
// but now we only set to en and a prepared 'catalog' prop
const i18nUIString = {
  "language":"en",
  catalog: i18nUIString_EN
};

const _set_HeadInfo = (pathCompare, obj) => {
  // change <title> & <meta name="title"> by url
  let title = "Cornerth.";
  let description = "";
  let baseURL = domain.protocol+ '://'+domain.name;
  switch (pathCompare) {

    case baseURL + '/?process=signin':
      title = "Sign in | Cornerth.";
      description = i18nUIString.catalog.message_Signin_intro[0] + '\xa0' + i18nUIString.catalog.message_Signin_intro[1];
      break;
    case baseURL + '/signup':
      title = "Sign up | Cornerth."
      for(let i=0; i < i18nUIString.catalog.descript_Sign_termsDeclaim.length ; i++){
        description += i18nUIString.catalog.descript_Sign_termsDeclaim[i];
      };
      break;
    case baseURL + '/':
      description = i18nUIString.catalog.guiding_IndexUnsign_FeedBrowse;
      break;
    default:

  };
  document.title = title;
  document.querySelector('meta[name="title"]').setAttribute("content", title);
  document.querySelector('meta[property="og:title"]').setAttribute("content", title);
  document.querySelector('meta[name="description"]').setAttribute("content", description);
}

module.exports = _set_HeadInfo;
