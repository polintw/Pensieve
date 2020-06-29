import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware} from "redux";
import thunk from 'redux-thunk';
import {Provider} from "react-redux";
import Sign from './Sign.jsx'
import storeSign from "../redux/reducers/sign.js";

let loggedin = !!window.localStorage['token'];
if(loggedin){
  axios.get('/router/status', {
    headers: {
        'token': window.localStorage['token']
    }
  }).then(function(res){
    // special case : unsubscrube
    if(window.location.pathname.includes('/unsubscribe')) { // pass it to /unsubscribe, let the comp check token itself
      const store = createStore(storeSign, applyMiddleware(thunk));
      ReactDOM.hydrate(<Provider store={store}><Sign/></Provider>, document.getElementById("root"));
    }
    else
    // any other situation
    window.location.assign('/');
  }).catch((err)=>{
    if (err.response) {
      // The request was made and the server responded with a status code that falls out of the range of 2xx
      console.log("response status: "+ err.response.status);
      if(err.response.status < 500){
        const store = createStore(storeSign, applyMiddleware(thunk));
        ReactDOM.hydrate(<Provider store={store}><Sign/></Provider>, document.getElementById("root"));
      }else{
        alert('Failed: '+err.response.data.message)
      }
    } else if (err.request) {
        // The request was made but no response was received
        // `err.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(err.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', err.message);
    }
  })
}else{
  const store = createStore(storeSign, applyMiddleware(thunk));
  ReactDOM.hydrate(<Provider store={store}><Sign/></Provider>, document.getElementById("root"));
}
