import {
  uncertainErr
} from "../utils/errHandlers.js";

const tokenRefreshed = ()=>{
  //notice we use post here, more safe but need a blank obj for post body
  return axios.post('/router/refresh',
    {
      'tokenRefresh': window.localStorage['tokenRefresh']
    },
    {
      headers: {
        'charset': 'utf-8'
    }
  }).then(function (res) {
    window.localStorage['token'] = res.data.token; //'access token', used in usual case
    //also renew tokenRefresh
    //But !! currently, this is not safe enough
    window.localStorage['tokenRefresh'] = res.data.tokenRefresh;
    return Promise.resolve();
  }).catch(function (thrown) {
    //deal the axios error with standard axios err handler first
    //to see if the error came from the axios
    let message = uncertainErr(thrown);
    //than throw back to upper call
    if(message){
      //pass the error back to stop the chain
      throw new Error(message);
    }else{
      //or just sign in again
      window.location.assign('/s/signin');
    }
  });
}

module.exports = tokenRefreshed;
