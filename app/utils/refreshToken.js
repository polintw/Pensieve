
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
  }).catch(function (error) {
    //this method was usually called by a root.js, 
    //we pass the error back to let them judge
    throw error;
  });
}

module.exports = tokenRefreshed;
