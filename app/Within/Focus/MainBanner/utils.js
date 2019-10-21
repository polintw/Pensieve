import React from 'react';

export function axios_feedList_customNew(cancelToken){
  let url = '/router/feed/custom/new';

  return axios.get(url, {
    headers: {
      'charset': 'utf-8',
      'token': window.localStorage['token']
    },
    cancelToken: cancelToken
  }).then(function (res) {
    let resObj = JSON.parse(res.data);

    return resObj;
  }).catch(function (thrown) {
    throw thrown;
  });
}

export function axios_feedList_customSelected(cancelToken, require){
  let url = '/router/feed/custom/selected?require='+require;

  return axios.get(url, {
    headers: {
      'charset': 'utf-8',
      'token': window.localStorage['token']
    },
    cancelToken: cancelToken
  }).then(function (res) {
    let resObj = JSON.parse(res.data);

    return resObj;
  }).catch(function (thrown) {
    throw thrown;
  });
}

export function axios_Units(cancelToken, reqList){
  //compose url to a string, due to unknonw reason to axios that the prop "params" didn'y work
  //and Notice ! reqList would be empty if no item in list, but it would cause error when compose url

  return axios.get('/router/units', {
    headers: {
      'charset': 'utf-8',
      'token': window.localStorage['token']
    },
    params: {
      unitsList: (reqList.length>0)? reqList : "[]"
    },
    cancelToken: cancelToken
  }).then(function (res) {
    let resObj = JSON.parse(res.data);

    return resObj;
  }).catch(function (thrown) {
    throw thrown;
  });
}
