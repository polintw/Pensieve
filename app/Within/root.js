import React from 'react';
import ReactDOM from 'react-dom';
import Within from './Within.jsx'

let loggedin = !!window.localStorage['token'];
if(loggedin){
  axios.get('/router/status', {
    headers: {
        'token': window.localStorage['token']
    }
  }).then(function(res){
    let resStatus = res.status;
    if(resStatus == 200){
        ReactDOM.hydrate(<Within userBasic={res.data.userBasic}/>, document.getElementById("root"));
    }else{
      console.log("response status: "+resStatus);
      console.log("response data: "+res.data);
      window.location.assign('/login')
    }
  }).catch((err)=>{
    if (err.response) {
      // The request was made and the server responded with a status code that falls out of the range of 2xx
      console.log("response status: "+ err.response.status);
      if(err.response.status < 500) window.location.assign('/login');
    } else if (err.request) {
        // The request was made but no response was received
        // `err.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(err.request);
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', err.message);
    }
    console.log("error config: "+err.config);
  })
}else{
  window.location.assign('/login')
}
