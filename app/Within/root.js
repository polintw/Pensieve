import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import jwtDecode from 'jwt-decode';
import moment from 'moment';
import store from './store.js';
import Within from './Within.jsx';
import {
  mountUserInfo,
  setTokenStatus
} from "../redux/actions/general.js";
import tokenRefreshed from '../utils/refreshToken.js';
import {
  statusVerifiedErr
} from "../utils/errHandlers.js";


let loggedin = !!window.localStorage['token'];
if(loggedin){
  const statusVerified = ()=>{ //could be a independent utils like the /refreshToken
    axios.get('/router/status', {
      headers: {
          'token': window.localStorage['token']
      }
    }).then(function(res){
      const resObj = JSON.parse(res.data);
      store.dispatch(mountUserInfo(resObj.main.userInfo));
      store.dispatch(setTokenStatus({token: 'verified'})); //also set token verified result to middleware.
      ReactDOM.hydrate(<Provider store={store}><Within/></Provider>, document.getElementById("root"));
    }).catch((err)=>{
      /*
      one possiblity is the token was invalid,
      then we still going to render after we mark the result in Redux.
      */
      statusVerifiedErr(err, store); //set token status to Redux by f() import from errHandlers
      //Render the dom no matter the result of the errHandlers,
      //and let the DOM itself check the status
      ReactDOM.hydrate(<Provider store={store}><Within/></Provider>, document.getElementById("root"));

    })
  };

  let decoded = jwtDecode(window.localStorage['token']);
  let deadline = moment.unix(decoded.exp).subtract(12, 'h');//refresh token earlier in case the user log out during the surfing
  let expired = moment().isAfter(deadline);

  if(expired){
     //send 'refresh' token, which get when last renew
     //return to status check after new token back

    tokenRefreshed().then(()=>{
      statusVerified();
    }).catch((error)=>{
      statusVerifiedErr(error, store);
      //Render the dom no matter the result of the errHandlers,
      //and let the DOM itself check the status
      ReactDOM.hydrate(<Provider store={store}><Within /></Provider>, document.getElementById("root"));
    })

   }
  else{
    //still check status, get basic data
    //and then render view
    statusVerified();
  }

}else{
  store.dispatch(setTokenStatus({token: 'lack'}));

  //Render the dom, let the index be previewed, sign in/up in a modal
  ReactDOM.hydrate(<Provider store={store}><Within/></Provider>, document.getElementById("root"));
}
