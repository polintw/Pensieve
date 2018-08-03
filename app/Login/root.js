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
    if(resStatus == 200 && !res.data.error){
      window.location.assign('/')
    }else{
      ReactDOM.hydrate(<Login/>, document.getElementById("root"));
    }
  }).catch(
      (err)=>{
          console.log('err during promise of check authorization: '+err);
          res.status(500).json({
            success: false,
            err: err
          });
      }
  )
}else{
  ReactDOM.hydrate(<Login/>, document.getElementById("root"));
}
