import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware} from "redux";
import thunk from 'redux-thunk';
import {Provider} from "react-redux";
import jwtDecode from 'jwt-decode';
import moment from 'moment';
import Within from './Within.jsx';
import storeWithin from "../redux/reducers/within.js";
import {mountUserInfo} from "../redux/actions/general.js";
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
      const store = createStore(storeWithin, applyMiddleware(thunk));
      store.dispatch(mountUserInfo(res.data.userInfo));
      ReactDOM.hydrate(<Provider store={store}><Within/></Provider>, document.getElementById("root"));
    }).catch((err)=>{
      //deal the axios error with standard axios err handler first
      let message = uncertainErr(err);
      //than alert the user before sign in again
      if(message){
        alert(message);
        window.location.assign('/s/signin');
      }
    })
  };

  let decoded = jwtDecode(window.localStorage['token']);
  let deadline = moment.unix(decoded.exp).subtract(12, 's');//refresh token earlier in case the user log out during the surfing
  let expired = moment().isAfter(deadline);

  if(expired){
     //send 'refresh' token, which get when last renew
     //return to status check after new token back

    tokenRefreshed().then(()=>{
      statusVerified();
    }).catch((error)=>{
      alert(error.message);
      window.location.assign('/s/signin');
    })

   }
  else{
    //still check status, get basic data
    //and then render view
    statusVerified();
  }

}else{
  window.location.assign('/s/signin')
}
