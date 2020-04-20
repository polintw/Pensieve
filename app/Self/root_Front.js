import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware} from "redux";
import thunk from 'redux-thunk';
import {Provider} from "react-redux";
import jwtDecode from 'jwt-decode';
import moment from 'moment';
import Front from './Front.jsx'
import storeSelfFront from "../redux/reducers/selfFront.js";
import {
  mountUserInfo,
  setTokenStatus
} from "../redux/actions/general.js";
import tokenRefreshed from '../utils/refreshToken.js';
import {
  uncertainErr
} from "../utils/errHandlers.js";

let loggedin = !!window.localStorage['token'];
if(loggedin){
  const statusVerified = ()=>{ //could be a independent utils like the /refreshToken
    axios.get('/router/status', {
      headers: {
          'token': window.localStorage['token']
      }
    }).then(function(res){
      const store = createStore(storeSelfFront, applyMiddleware(thunk));
      const resObj = JSON.parse(res.data);
      store.dispatch(mountUserInfo(resObj.main.userInfo));
      store.dispatch(setTokenStatus({token: 'verified'})); //also set token verified result to middleware.
      ReactDOM.hydrate(<Provider store={store}><Front/></Provider>, document.getElementById("root"));
    }).catch((err)=>{
      //deal the axios error with standard axios err handler first
      let message = uncertainErr(err);
      //than alert the user before sign in again
      if(message){
        alert(message);
        window.location.assign('/');
      }
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
      alert(error.message);
      window.location.assign('/');
    })

   }
  else{
    //still check status, get basic data
    //and then render view
    statusVerified();
  }
}else{
  window.location.assign('/') //back to index, the index would decide how to dealt with a no token situation(sign in/up)
}
