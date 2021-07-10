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
  let image = '';
  let url = window.location.href;
  let baseURL = domain.protocol+ '://'+domain.name;
  // if there were an obj sent
  if(!!obj){
    title = 'title' in obj ? obj.title : title;
    description = 'description' in obj ? obj.description : description;
    image = 'img' in obj ? (baseURL + "/router/img/" + obj.img) : image;
    url = 'url' in obj ? obj.url : url;
  };
  // and then handle some of the specific path
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
     // do nothing to keep the result from prev. steps
  };
  document.title = title;
  document.querySelector('meta[name="title"]').setAttribute("content", title);
  document.querySelector('meta[property="og:title"]').setAttribute("content", title);
  document.querySelector('meta[name="description"]').setAttribute("content", description);
  document.querySelector('meta[property="og:image"]').setAttribute("content", image);
  document.querySelector('meta[property="og:url"]').setAttribute("content", url);
}

module.exports = _set_HeadInfo;
