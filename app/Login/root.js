import React from 'react';
import ReactDOM from 'react-dom';
import Login from './Login.jsx'

let loggedin = !!window.localStorage['token'];
if(loggedin){
  axios.get('/router/status', {
    headers: {
        'token': window.localStorage['token']
    }
  }).then(function(res){
    let resStatus = res.status;
    if(resStatus == 200){
      window.location.assign('/')
    }else{
      console.log("response status: "+resStatus);
      ReactDOM.hydrate(<Login/>, document.getElementById("root"));
    }
  }).catch((err)=>{
    if (err.response) {
      // The request was made and the server responded with a status code that falls out of the range of 2xx
      console.log("response status: "+ err.response.status);
      if(err.response.status < 500) ReactDOM.hydrate(<Login/>, document.getElementById("root"));
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
  ReactDOM.hydrate(<Login/>, document.getElementById("root"));
}
