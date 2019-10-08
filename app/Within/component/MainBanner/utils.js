import React from 'react';

export function axios_Main_Banner(cancelToken){
  let url = '/router/feed/banner';

  return axios.get(url, {
    headers: {
      'charset': 'utf-8',
      'token': window.localStorage['token']
    },
    cancelToken: cancelToken
  }).then(function (res) {
    let resObj = JSON.parse(res.data);

    //data(perhaps nodes list) need to render after lastvisit check
    return resObj;
  }).catch(function (thrown) {
    throw thrown;
  });
}
