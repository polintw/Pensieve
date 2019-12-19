import React from 'react';


export function axios_get_wish_list(cancelToken){
  let url = '/router/matchNodes/list/user';

  return axios.get(url, {
    headers: {
      'charset': 'utf-8',
      'token': window.localStorage['token']
    },
    params: {
      desire: 'wished'
    },
    cancelToken: cancelToken
  }).then(function (res) {
    let resObj = JSON.parse(res.data);

    return resObj;
  }).catch(function (thrown) {
    throw thrown;
  });
}


export function axios_patch_wish_make(cancelToken, nodeId, source){
  let url = '/router/matchNodes/setting/wish';

  return axios({
    url:url,
    method: "patch",
    headers: {
      'charset': 'utf-8',
      'token': window.localStorage['token']
    },
    params: !!source? {order: true} : {},
    data: {'wishList': [nodeId]},
    cancelToken: cancelToken
  }).then(function (res) {
    let resObj = JSON.parse(res.data);

    return resObj;
  }).catch(function (thrown) {
    throw thrown;
  });
}

export function axios_delete_wish(cancelToken, nodeId){
  let url = '/router/matchNodes/setting/wish';

  return axios({
    url:url,
    method: "patch",
    headers: {
      'charset': 'utf-8',
      'token': window.localStorage['token']
    },
    params: {
      delete: true
    },
    data: {'wishList': [nodeId]},
    cancelToken: cancelToken
  }).then(function (res) {
    let resObj = JSON.parse(res.data);

    return resObj;
  }).catch(function (thrown) {
    throw thrown;
  });
}
