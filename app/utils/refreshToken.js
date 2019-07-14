import {
  uncertainErr
} from "../utils/errHandlers.js";

const tokenRefreshed = ()=>{
  return axios.post('/router/refresh', {
    headers: {
      'charset': 'utf-8',
      'tokenRefresh': window.localStorage['tokenRefresh']
    },
  }).then(function (res) {
    window.localStorage['token'] = res.data.token; //'access token', used in usual case
    //also renew tokenRefresh
    //But !! currently, this is not safe enough
    window.localStorage['tokenRefresh'] = res.data.tokenRefresh;

  }).catch(function (thrown) {
    if(err.response.status < 500) window.location.assign('/s/signin')
    else{
      let message = uncertainErr(thrown);
      if(message) alert(message);
    }
  });
}

module.exports = tokenRefreshed;
